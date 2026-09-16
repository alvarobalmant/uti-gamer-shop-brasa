// Receives Mercado Pago webhook notifications (Orders API / Checkout Pro),
// validates the signature, syncs order status and applies stock atomically.
// Idempotent: each notification event is stored in payment_events (unique per
// provider + event_id) and repeated deliveries are ignored.

import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { mapOrderStatus, mpFetch, verifyWebhookSignature } from '../_shared/mercadopago.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const MP_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') ?? '';
const MP_WEBHOOK_SECRET = Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET') ?? '';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return json({ error: 'Método não permitido' }, 405);
  }

  const url = new URL(req.url);
  interface WebhookBody {
    id?: number | string;
    type?: string;
    topic?: string;
    data?: { id?: number | string };
  }
  let body: WebhookBody | null = null;
  if (req.method === 'POST') {
    try {
      body = await req.json();
    } catch {
      body = null;
    }
  }

  const dataId = url.searchParams.get('data.id') ?? body?.data?.id ?? null;
  const topic =
    url.searchParams.get('topic') ?? url.searchParams.get('type') ?? body?.type ?? body?.topic ?? 'unknown';
  const eventId = String(body?.id ?? `manual-${dataId ?? 'unknown'}`);

  // ---- Signature validation (manifest: id, request-id, ts) — fail closed ----
  if (!MP_WEBHOOK_SECRET) {
    console.error('MERCADOPAGO_WEBHOOK_SECRET not configured — rejecting notification');
    return json({ error: 'Webhook não configurado' }, 401);
  }
  const validSignature = await verifyWebhookSignature(
    MP_WEBHOOK_SECRET,
    req.headers.get('x-signature'),
    req.headers.get('x-request-id'),
    dataId ? String(dataId) : null,
  );
  if (!validSignature) {
    console.error('webhook signature invalid');
    return json({ error: 'Assinatura inválida' }, 401);
  }

  if (!dataId) return json({ received: true, ignored: 'no data.id' });

  if (!MP_ACCESS_TOKEN || !SUPABASE_SERVICE_ROLE_KEY) {
    return json({ error: 'Gateway não configurado' }, 503);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // ---- Resolve the Mercado Pago order id ----
  let mpOrderId: string | null = null;
  let mpPaymentId: string | null = null;

  try {
    if (String(topic).includes('payment')) {
      const payRes = await mpFetch(MP_ACCESS_TOKEN, `/v1/payments/${dataId}`);
      const payJson = await payRes.json().catch(() => null);
      if (!payRes.ok || !payJson) {
        console.error('payment lookup failed', payRes.status);
        return json({ received: true, ignored: 'payment lookup failed' });
      }
      mpPaymentId = String(payJson.id ?? dataId);
      mpOrderId = payJson?.order?.id ? String(payJson.order.id) : null;
      if (!mpOrderId) {
        // Legacy-style notification without an order reference — nothing to sync.
        return json({ received: true, ignored: 'payment without order' });
      }
    } else {
      mpOrderId = String(dataId);
    }

    // ---- Fetch authoritative order state from Mercado Pago ----
    const orderRes = await mpFetch(MP_ACCESS_TOKEN, `/v1/orders/${mpOrderId}`);
    const mpOrder = await orderRes.json().catch(() => null);
    if (!orderRes.ok || !mpOrder) {
      console.error('order lookup failed', orderRes.status);
      return json({ received: true, ignored: 'order lookup failed' });
    }

    const mapped = mapOrderStatus(mpOrder.status, mpOrder.status_detail);
    if (!mpPaymentId && mpOrder?.transactions?.payments?.length) {
      mpPaymentId = String(mpOrder.transactions.payments[0]?.id ?? '');
    }

    // ---- Locate internal order ----
    interface InternalOrder {
      id: string;
      status: string;
      payment_status: string;
      stock_applied: boolean;
    }
    let internal: InternalOrder | null = null;
    const byMpId = await supabase
      .from('orders')
      .select('id, status, payment_status, stock_applied')
      .eq('mercadopago_order_id', mpOrderId)
      .maybeSingle();
    internal = byMpId.data;
    if (!internal && mpOrder.external_reference) {
      const byRef = await supabase
        .from('orders')
        .select('id, status, payment_status, stock_applied')
        .eq('external_reference', String(mpOrder.external_reference))
        .maybeSingle();
      internal = byRef.data;
      if (internal) {
        await supabase
          .from('orders')
          .update({ mercadopago_order_id: mpOrderId })
          .eq('id', internal.id);
      }
    }
    if (!internal) {
      console.error('webhook: no internal order for MP order', mpOrderId);
      return json({ received: true, ignored: 'unknown order' });
    }

    // ---- Idempotency claim: insert event; conflict = already processed ----
    const claim = await supabase
      .from('payment_events')
      .insert({
        provider: 'mercadopago',
        event_id: eventId,
        event_type: String(topic),
        provider_order_id: mpOrderId,
        order_id: internal.id,
        payload: body ?? { data_id: dataId, topic },
      })
      .select('id')
      .maybeSingle();

    if (claim.error) {
      // unique(provider, event_id) violation → duplicate delivery
      return json({ received: true, duplicate: true });
    }

    // ---- Sync status ----
    if (internal.payment_status !== mapped.payment_status) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: mapped.payment_status,
          status: mapped.status,
          ...(mpPaymentId ? { mercadopago_payment_id: mpPaymentId } : {}),
        })
        .eq('id', internal.id);
      if (updateError) {
        console.error('order update failed', updateError);
        return json({ error: 'update failed' }, 500);
      }

      // Definitive server-side confirmation only — apply stock exactly once.
      if (mapped.payment_status === 'approved' && !internal.stock_applied) {
        const { data: stockOk, error: stockError } = await supabase.rpc('apply_order_stock', {
          p_order_id: internal.id,
        });
        if (stockError) console.error('apply_order_stock failed', stockError);
        else if (stockOk === false) console.warn('stock already applied for order', internal.id);
      }
    }

    await supabase
      .from('payment_events')
      .update({ processed_at: new Date().toISOString() })
      .eq('provider', 'mercadopago')
      .eq('event_id', eventId);

    return json({ received: true, payment_status: mapped.payment_status });
  } catch (e) {
    console.error('webhook processing error', e);
    // Return 500 so Mercado Pago retries this notification.
    return json({ error: 'processing error' }, 500);
  }
});
