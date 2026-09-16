// Shared Mercado Pago helpers for UTI Gamer Shop Brasa edge functions.
// Never log or return the access token.

export const MP_API_BASE = 'https://api.mercadopago.com';

// Shipping rules — must stay in sync with src/utils/priceCalculations.ts
export const FREE_SHIPPING_THRESHOLD_CENTS = 15000; // R$ 150,00
export const STANDARD_SHIPPING_CENTS = 1500; // R$ 15,00

/** Format integer cents as a BRL decimal string ("123.45"). */
export function toBRL(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function shippingCentsFor(subtotalCents: number): number {
  if (subtotalCents <= 0) return 0;
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : STANDARD_SHIPPING_CENTS;
}

/**
 * Validates the x-signature header of a Mercado Pago webhook notification.
 * Manifest format: "id:<data.id>;request-id:<x-request-id>;ts:<ts>;"
 */
export async function verifyWebhookSignature(
  secret: string,
  xSignature: string | null,
  xRequestId: string | null,
  dataId: string | null,
): Promise<boolean> {
  if (!secret || !xSignature) return false;
  const parts: Record<string, string> = {};
  for (const chunk of xSignature.split(',')) {
    const idx = chunk.indexOf('=');
    if (idx > 0) parts[chunk.slice(0, idx).trim()] = chunk.slice(idx + 1).trim();
  }
  const ts = parts['ts'];
  const v1 = parts['v1'];
  if (!ts || !v1) return false;

  const manifest = `id:${dataId ?? ''};request-id:${xRequestId ?? ''};ts:${ts};`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(manifest));
  const hex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  // Constant-time-ish comparison
  if (hex.length !== v1.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ v1.charCodeAt(i);
  return diff === 0;
}

export interface MappedOrderStatus {
  payment_status: 'pending' | 'approved' | 'rejected' | 'refunded' | 'cancelled';
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
}

/**
 * Maps a Mercado Pago Orders API (v1/orders) status + status_detail
 * to our internal order states.
 * Docs: /developers/pt/docs/checkout-pro-orders/payment-management/status/order-status
 */
export function mapOrderStatus(mpStatus: string | undefined, mpDetail: string | undefined): MappedOrderStatus {
  switch (mpStatus) {
    case 'processed':
      if (mpDetail === 'refunded' || mpDetail === 'partially_refunded') {
        return { payment_status: 'refunded', status: 'refunded' };
      }
      return { payment_status: 'approved', status: 'paid' }; // accredited
    case 'refunded':
      return { payment_status: 'refunded', status: 'refunded' };
    case 'failed':
      return { payment_status: 'rejected', status: 'cancelled' };
    case 'canceled':
    case 'cancelled':
      return { payment_status: 'cancelled', status: 'cancelled' };
    case 'action_required':
    case 'processing':
    case 'created':
    default:
      return { payment_status: 'pending', status: 'pending' };
  }
}

/** Authenticated fetch against the Mercado Pago API. */
export async function mpFetch(
  accessToken: string,
  path: string,
  init?: RequestInit & { idempotencyKey?: string },
): Promise<Response> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
  if (init?.idempotencyKey) {
    headers['X-Idempotency-Key'] = init.idempotencyKey;
  }
  return fetch(`${MP_API_BASE}${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers as Record<string, string> | undefined) },
  });
}
