# Auditoria: preparar pagamento com Mercado Pago Checkout Pro (Orders API)

Nenhum arquivo foi alterado. Abaixo o retrato do que existe hoje e a arquitetura proposta.

## Arquitetura atual (resumo)

Hoje a loja **não tem pagamento online**. A compra termina no WhatsApp:

```text
Carrinho (localStorage) -> cálculo de total no navegador
   -> RPC create_order_verification_code (gera código do pedido)
   -> mensagem montada e aberta no WhatsApp
   -> loja fecha a venda manualmente e valida o código no painel
```

## Estrutura atual do carrinho

- Armazenado **apenas no navegador**, chave `uti-games-cart` do localStorage.
- Hooks: `src/hooks/useNewCart.ts` (o que roda), mais `useCart.ts`, `useCartState.ts`, `useCartSync.ts`, `useCartPersistence.ts` (duplicados/legados).
- Contexto: `src/contexts/CartContext.tsx`. UI: `src/components/Cart.tsx`, `src/components/Cart/ProfessionalCartModal.tsx`, `src/components/GlobalCart/GlobalCartDropdown.tsx`.
- Existe a tabela `cart_items` no banco, mas **não é usada** por nenhum fluxo.

## Preço e total

- Preço vem da tabela `products` (campos `price`, `promotional_price`, `uti_pro_price`, `uti_coins_*`), lido em `src/hooks/useProducts/productApi.ts`.
- Total é calculado **no navegador**: `src/utils/priceCalculations.ts`, `useNewCart.getCartTotal()`, e uma segunda vez dentro de `src/utils/whatsapp.ts` (inclusive frete: grátis acima de R$ 150, senão R$ 15). Há divergência de regra entre os dois lugares.
- Descontos de UTI Coins também são decididos no cliente.

## Onde a compra é finalizada

- `src/components/Layout/CheckoutButton.tsx`, `Cart.tsx`, `ProfessionalCartModal.tsx` e `src/components/Product/PurchaseConfirmationModal.tsx` -> todos chamam `sendToWhatsApp` de `src/utils/whatsapp.ts`.
- `src/pages/CheckoutPage.tsx`, `CartPage.tsx` e `OrderConfirmationPage.tsx` são páginas vazias (placeholders).

## Pedidos hoje

- **Não existe** tabela de pedidos nem de itens do pedido.
- O mais próximo é `order_verification_codes`: guarda `code`, `items` (JSON solto), `total_amount`, `customer_info`, `status`, dados de UTI Coins e expiração. Serve como código de retirada, não como pedido.
- `src/hooks/useUserOrders.ts` já retorna lista vazia com um comentário dizendo que a tabela de pedidos não existe.

## Identificação do cliente

- Supabase Auth via `src/hooks/useAuth.tsx`; perfil em `user_profiles`; papel de admin já resolvido por função no banco.
- Compra funciona **sem login** — o código de pedido aceita `user_id` nulo.

## Estoque

- Campo `stock` em `products`, usado apenas para exibir "em estoque" e no painel admin.
- **Nenhuma baixa de estoque, nenhuma reserva, nenhuma validação na finalização.**

## Edge Functions existentes

`admin-auto-login`, `compress-images`, `confirm-email-and-redirect`, `daily-codes`, `expire-order-codes`, `image-proxy`, `scan-storage`, `search-weighted`, `secure-coin-actions`, `storage-manager`, `storage-stats`.
Nenhuma relacionada a pagamento. Nenhum segredo configurado no projeto ainda (nada de Mercado Pago).

## O que pode ser reutilizado

- Tabela `products` como fonte única de preço (já limpa depois do rework).
- Supabase Auth + `user_profiles` para dono do pedido.
- Sistema de UTI Coins (`secure-coin-actions`) para cashback após pagamento aprovado.
- Páginas vazias `CheckoutPage` / `OrderConfirmationPage` como destino do novo fluxo.
- E-mails transacionais já existentes para confirmação de pedido.

## O que precisa mudar

- Criar pedido de verdade no banco **antes** de mandar para o pagamento.
- Mover o cálculo de subtotal, desconto, coins e frete para o servidor; o navegador passa a mandar só `product_id` + quantidade.
- Unificar as regras de preço (hoje duplicadas em `priceCalculations.ts` e `whatsapp.ts`).
- Transformar `CheckoutPage` em fluxo real (revisão, dados do cliente, entrega) e `OrderConfirmationPage` em página de retorno.
- Manter o WhatsApp como opção alternativa, não como único caminho.
- Baixar estoque somente quando o pagamento for aprovado.

## Arquitetura proposta (Mercado Pago Checkout Pro, Orders API)

```text
Frontend (checkout) --envia apenas itens e ids-->
Edge Function create-payment-order
  1. recarrega preços de products
  2. recalcula subtotal, descontos, coins, frete
  3. valida estoque
  4. grava orders + order_items (status pending)
  5. chama Orders API do Mercado Pago (type: online, checkout Pro)
  6. devolve checkout_url
Frontend redireciona --> Checkout Pro --> pagamento
Mercado Pago --webhook--> Edge Function mercadopago-webhook
  valida assinatura, consulta a ordem na API, atualiza status,
  baixa estoque, credita UTI Coins, dispara e-mail
Frontend volta para /pedido/:id e lê o status do banco
```

### Migrations necessárias

1. `orders` — `id`, `order_number`, `user_id` (nulo permitido), `customer_info`, `shipping_info`, `subtotal`, `discount_total`, `coins_discount`, `shipping_cost`, `total_amount`, `status`, `payment_status`, `payment_provider`, `provider_order_id`, `provider_preference_id`, `checkout_url`, timestamps. RLS: cliente vê os próprios, admin vê todos, escrita só pelo service role.
2. `order_items` — `order_id`, `product_id`, `product_name`, `unit_price`, `quantity`, `line_total` (preço congelado no momento da compra). Mesmo padrão de RLS via `order_id`.
3. `payment_events` — log bruto de webhooks (`provider_order_id`, `event_type`, `payload`, `processed_at`) para idempotência e auditoria.
4. Função de baixa de estoque atômica (`decrement_stock`) usada só pelo webhook.
5. `GRANT`s explícitos para `authenticated`/`anon`/`service_role` conforme as políticas.

### Edge Functions necessárias

- `create-payment-order` (JWT opcional, aceita convidado): recalcula tudo, cria pedido, cria a Order no Mercado Pago, retorna `checkout_url`.
- `mercadopago-webhook` (`verify_jwt = false`): recebe notificações, valida a assinatura `x-signature`, reconsulta a ordem na API, atualiza pedido, baixa estoque, credita coins — idempotente.
- Opcional: `get-order-status` ou apenas leitura direta via RLS na página de retorno.

### Segredos

- `MERCADOPAGO_ACCESS_TOKEN` (nunca no frontend).
- `MERCADOPAGO_WEBHOOK_SECRET` (o mesmo valor colado no painel do Mercado Pago).
- Public key só se for usado brick/cartão embutido — para Checkout Pro puro não é necessária.

### Regras de segurança adotadas

- Preço e total nunca vêm do navegador.
- Access token só existe dentro da Edge Function.
- Status do pedido muda apenas pelo webhook (a URL de retorno não é confiável).
- Webhook idempotente por `provider_order_id` + tipo de evento.
- Documentação oficial do Checkout Pro Orders API como referência de payload.

## Próximo passo

Esta etapa é só auditoria. Se aprovado, o próximo plano cobre as migrations, as duas Edge Functions e a reconstrução da página de checkout.
