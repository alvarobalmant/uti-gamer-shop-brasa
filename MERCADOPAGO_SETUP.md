# Integração Mercado Pago Checkout Pro (Orders API) — UTI Gamer Shop Brasa

Este documento descreve como configurar o pagamento online da loja.
**Nunca coloque credenciais reais neste arquivo.**

## Visão geral da arquitetura

```
Frontend (React)
  → Supabase Edge Function: create-mercadopago-order
    → valida itens, busca preços reais no banco, valida estoque,
      calcula subtotal/frete/total, grava o pedido em `orders`/`order_items`
    → POST https://api.mercadopago.com/v1/orders (Checkout Pro, processing_mode: manual)
  → retorna checkout_url
  → cliente é redirecionado ao Checkout Pro (Mercado Pago)
  → Mercado Pago chama o webhook
  → Supabase Edge Function: mercadopago-webhook
    → valida assinatura x-signature, consulta o status na API do Mercado Pago,
      atualiza `orders`, aplica baixa de estoque (função apply_order_stock)
  → cliente volta para /checkout/success | /checkout/pending | /checkout/failure
```

Regras de segurança aplicadas:

- O Access Token existe **somente** como secret da Edge Function. Nunca usar `VITE_MERCADOPAGO_ACCESS_TOKEN`.
- O navegador **não** é fonte de verdade de preço/total/status. A Edge Function recalcula tudo.
- A página de sucesso **não** confirma pagamento — só o webhook (ou consulta à API) confirma.
- Webhook é idempotente (tabela `payment_events` com unique `provider + event_id`).
- Cada criação de Order usa `X-Idempotency-Key` (exigido pela API de Orders).

## 1. Criar a aplicação no Mercado Pago

1. Acesse https://www.mercadopago.com.br/developers/panel e crie uma aplicação.
2. Em "Produtos", ative **Checkout Pro** (API de Orders).
3. Nas credenciais de produção, copie o **Access Token** (`APP_USR-...`).
   Para testes, use as credenciais de teste (`TEST-...`) e usuários/cartões de teste.

## 2. Configurar os secrets no Supabase

Em **Project Settings → Edge Functions → Secrets** (ou via Lovable), adicione:

| Secret | Valor |
| --- | --- |
| `MERCADOPAGO_ACCESS_TOKEN` | Access Token do Mercado Pago (`APP_USR-...` ou `TEST-...`) |
| `MERCADOPAGO_WEBHOOK_SECRET` | Chave secreta do webhook (configurada no passo 3) |
| `SITE_URL` (opcional) | URL pública da loja (ex.: `https://utidosgames.com`). Sem ela, as URLs de retorno usam o domínio de origem da requisição. |

## 3. Configurar o webhook no painel do Mercado Pago

1. Na aplicação, em **Webhooks / Notificações**, adicione a URL:
   `https://pmxnfpnnvtuuiedoxuxc.supabase.co/functions/v1/mercadopago-webhook`
2. Eventos: **Orders** (`orders_v2`) e, opcionalmente, **Payments**.
3. Copie a **chave secreta** exibida e salve como `MERCADOPAGO_WEBHOOK_SECRET`.

O webhook valida o header `x-signature` (HMAC-SHA256 do manifest
`id:<data.id>;request-id:<x-request-id>;ts:<ts>;`).

## 4. Ambiente de testes

- Use o Access Token `TEST-` e o secret de webhook de teste.
- Cartões de teste: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/your-integrations/test/cards
- Fluxo recomendado de teste: adicionar ao carrinho → Finalizar Compra → pagar
  com cartão de teste aprovado → verificar status em `/checkout/success` →
  conferir no banco que `orders.payment_status = 'approved'` e estoque baixado.
- Pix/boleto caem em `/checkout/pending` até a confirmação via webhook.
- Teste o webhook duplicando a notificação (deve ser ignorado, sem duplicar baixa de estoque).

## 5. Produção

1. Trocar o `MERCADOPAGO_ACCESS_TOKEN` para o token `APP_USR-` e o secret de webhook de produção.
2. Garantir que `SITE_URL` aponte para o domínio final.
3. Verificar no painel do Mercado Pago que as URLs de notificação apontam para o ambiente de produção.

## 6. Troubleshooting

| Sintoma | Causa provável | Como verificar |
| --- | --- | --- |
| "Pagamento indisponível" no checkout | `MERCADOPAGO_ACCESS_TOKEN` ausente | Secrets da Edge Function |
| Cliente paga mas pedido não atualiza | Webhook não chamado / secret errado | Logs da função `mercadopago-webhook` no painel Supabase |
| Webhook retorna 401 | Assinatura inválida | Conferir `MERCADOPAGO_WEBHOOK_SECRET` |
| Erro 4xx/5xx ao criar Order | Campos inválidos (total ≠ soma dos itens) | Logs da função `create-mercadopago-order` |
| Estoque não baixou | `apply_order_stock` só roda com pagamento `approved` | Conferir `orders.stock_applied` |

Logs das funções: https://supabase.com/dashboard/project/pmxnfpnnvtuuiedoxuxc/functions
