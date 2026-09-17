import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ success: false, error: 'method_not_allowed' }, 405);
  }

  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY não configurado');
    return json({ success: false, error: 'captcha_not_configured' }, 503);
  }

  let token: unknown;
  try {
    const body = await req.json();
    token = body?.token;
  } catch {
    return json({ success: false, error: 'invalid_body' }, 400);
  }

  if (typeof token !== 'string' || token.length < 10 || token.length > 4096) {
    return json({ success: false, error: 'invalid_token' }, 400);
  }

  const remoteIp =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    undefined;

  try {
    const form = new URLSearchParams();
    form.set('secret', secret);
    form.set('response', token);
    if (remoteIp) form.set('remoteip', remoteIp);

    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });

    const result = await res.json();

    if (result?.success === true) {
      return json({ success: true });
    }

    console.warn('Turnstile rejeitou o token', result?.['error-codes']);
    return json(
      { success: false, error: 'captcha_failed', codes: result?.['error-codes'] ?? [] },
      400,
    );
  } catch (err) {
    console.error('Falha ao validar Turnstile:', err instanceof Error ? err.message : 'erro desconhecido');
    return json({ success: false, error: 'verification_unavailable' }, 502);
  }
});
