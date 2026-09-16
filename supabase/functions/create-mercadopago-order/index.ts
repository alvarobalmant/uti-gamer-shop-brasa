// Creates an internal order and a Mercado Pago Checkout Pro Order (Orders API).
// Frontend sends ONLY product ids, quantities and customer data — never prices.
// All pricing, stock validation and totals are computed here, server-side.

import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
import {
  mpFetch,
  shippingCentsFor,
  toBRL,
} from '../_shared/mercadopago.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const MP_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') ?? '';

const ItemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

const BodySchema = z.object({
  items: z.array(ItemSchema).min(1).max(50),
  customer: z.object({
    name: z.string().trim().min(3).max(120),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().max(30).optional().nullable(),
  }),
  shipping: z
    .object({
      cep: z.string().trim().max(20).optional(),
      street: z.string().trim().max(200).optional(),
      number: z.string().trim().max(20).optional(),
      complement: z.string().trim().max(120).optional(),
      district: z.string().trim().max(120).optional(),
      city: z.string().trim().max(120).optional(),
      state: z.string().trim().max(2).optional(),
    })
    .optional()
    .nullable(),
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Método não permitido' }, 405);

  if (!MP_ACCESS_TOKEN) {
    return json({ error: 'Pagamento indisponível: credenciais não configuradas' }, 503);
  }

  // ---- Parse & validate input ----
  let parsedBody: z.infer<typeof BodySchema>;
  try {
    const raw = await req.json();
    const result = BodySchema.safeParse(raw);
    if (!result.success) {
      return json({ error: 'Dados inválidos', details: result.error.flatten().fieldErrors }, 400);
    }
    parsedBody = result.data;
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  // Deduplicate items by product_id (sum quantities)
  const qtyByProduct = new Map<string, number>();
  for (const item of parsedBody.items) {
    qtyByProduct.set(item.product_id, (qtyByProduct.get(item.product_id) ?? 0) + item.quantity);
  }
  const productIds = [...qtyByProduct.keys()];

  // ---- Identify optional logged-in user (never required) ----
  let customerId: string | null = null;
  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ') && SUPABASE_ANON_KEY) {
    try {
      const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false },
      });
      const { data } = await userClient.auth.getUser();
      if (data?.user) customerId = data.user.id;
    } catch {
      // Guest checkout — ignore
    }
  }

  // ---- Look up real products/prices/stock (server is the source of truth) ----
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, price, promotional_price, stock, is_active')
    .in('id', productIds);

  if (productsError) return json({ error: 'Erro ao consultar produtos' }, 500);

  const productMap = new Map((products ?? []).map((p) => [p.id, p]));

  interface Line {
    id: string;
    name: string;
    qty: number;
    unitCents: number;
    lineCents: number;
  }
  const lines: Line[] = [];

  for (const [id, qty] of qtyByProduct) {
    const p = productMap.get(id);
    if (!p || !p.is_active) return json({ error: 'Produto indisponível', product_id: id }, 400);
    if ((p.stock ?? 0) < qty) {
      return json(
        { error: `Estoque insuficiente para "${p.name}" (disponível: ${p.stock ?? 0})` },
        400,
      );
    }
    const price = Number(p.price ?? 0);
    const promo = Number(p.promotional_price ?? 0);
    const unit = promo > 0 && promo < price ? promo : price;
    const unitCents = Math.round(unit * 100);
    lines.push({ id, name: p.name, qty, unitCents, lineCents: unitCents * qty });
  }

  if (lines.length === 0) return json({ error: 'Nenhum produto válido no pedido' }, 400);

  const subtotalCents = lines.reduce((acc, l) => acc + l.lineCents, 0);
  const shippingCents = shippingCentsFor(subtotalCents);
  const totalCents = subtotalCents + shippingCents;

  // ---- Create internal order ----
  const externalReference = `UTI-${Date.now().toString(36).toUpperCase()}-${crypto
    .randomUUID()
    .replace(/-/g, '')
    .slice(0, 8)
    .toUpperCase()}`;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      external_reference: externalReference,
      customer_id: customerId,
      customer_name: parsedBody.customer.name,
      customer_email: parsedBody.customer.email,
      customer_phone: parsedBody.customer.phone ?? null,
      subtotal: toBRL(subtotalCents),
      shipping_cost: toBRL(shippingCents),
      discount_total: '0.00',
      total_amount: toBRL(totalCents),
      currency: 'BRL',
      status: 'pending',
      payment_status: 'pending',
      payment_provider: 'mercadopago',
      shipping_info: parsedBody.shipping ?? null,
      metadata: { source: 'checkout', item_count: lines.reduce((a, l) => a + l.qty, 0) },
    })
    .select('id, order_number, external_reference')
    .single();

  if (orderError || !order) {
    console.error('order insert failed', orderError);
    return json({ error: 'Erro ao registrar o pedido' }, 500);
  }

  const { error: itemsError } = await supabase.from('order_items').insert(
    lines.map((l) => ({
      order_id: order.id,
      product_id: l.id,
      product_name: l.name,
      quantity: l.qty,
      unit_price: toBRL(l.unitCents),
      total_price: toBRL(l.lineCents),
    })),
  );
  if (itemsError) {
    console.error('order_items insert failed', itemsError);
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
    return json({ error: 'Erro ao registrar os itens do pedido' }, 500);
  }

  // ---- Build Mercado Pago Order (Checkout Pro / Orders API) ----
  // Sum of items[].total_amount must equal total_amount exactly — shipping is
  // included as its own line item.
  const mpItems = lines.map((l) => ({
    title: l.name.slice(0, 250),
    quantity: l.qty,
    unit_price: toBRL(l.unitCents),
    unit_measure: 'unit',
    total_amount: toBRL(l.lineCents),
  }));
  if (shippingCents > 0) {
    mpItems.push({
      title: 'Frete',
      quantity: 1,
      unit_price: toBRL(shippingCents),
      unit_measure: 'unit',
      total_amount: toBRL(shippingCents),
    });
  }

  const siteUrl = (Deno.env.get('SITE_URL') ?? req.headers.get('origin') ?? 'https://utidosgames.com')
    .replace(/\/+$/, '');
  const returnBase = `${siteUrl}/checkout`;

  const mpPayload = {
    type: 'online',
    processing_mode: 'manual',
    total_amount: toBRL(totalCents),
    external_reference: externalReference,
    description: `Pedido ${order.order_number} - UTI Gamer Shop Brasa`.slice(0, 250),
    payer: { email: parsedBody.customer.email },
    items: mpItems,
    config: {
      notification_url: `${SUPABASE_URL}/functions/v1/mercadopago-webhook`,
      online: {
        success_url: `${returnBase}/success?ref=${externalReference}`,
        failure_url: `${returnBase}/failure?ref=${externalReference}`,
        pending_url: `${returnBase}/pending?ref=${externalReference}`,
        auto_return: 'all',
      },
    },
  };

  const clientIdempotencyKey = req.headers.get('x-idempotency-key');
  const idempotencyKey =
    clientIdemKeyIsValid(clientIdempotencyKey) ?? crypto.randomUUID();

  let mpResponse: Response;
  try {
    mpResponse = await mpFetch(MP_ACCESS_TOKEN, '/v1/orders', {
      method: 'POST',
      idempotencyKey,
      body: JSON.stringify(mpPayload),
    });
  } catch (e) {
    console.error('mercado pago fetch failed', e);
    return json({ error: 'Falha de conexão com o gateway de pagamento' }, 502);
  }

  const mpJson = await mpResponse.json().catch(() => null);

  if (!mpResponse.ok || !mpJson?.id) {
    console.error('mercado pago create failed', mpResponse.status);
    await supabase
      .from('orders')
      .update({ status: 'cancelled', metadata: { source: 'checkout', mp_error: mpResponse.status } })
      .eq('id', order.id);
    return json({ error: 'Não foi possível iniciar o pagamento. Tente novamente.' }, 502);
  }

  const checkoutUrl: string | undefined = mpJson.checkout_url;
  await supabase
    .from('orders')
    .update({
      mercadopago_order_id: String(mpJson.id),
      checkout_url: checkoutUrl ?? null,
      metadata: { source: 'checkout', idempotency_key: idempotencyKey },
    })
    .eq('id', order.id);

  return json({
    order_id: order.id,
    order_number: order.order_number,
    external_reference: order.external_reference,
    total_amount: toBRL(totalCents),
    checkout_url: checkoutUrl,
  });
});

function clientIdemKeyIsValid(value: string | null): string | null {
  if (!value) return null;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
    ? value
    : null;
}
