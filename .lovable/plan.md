
# Plano: Rework do Sistema de Produtos — Tabela Única `products`

## Diagnóstico

Hoje o produto está "bagunçado" por 3 motivos combinados:

1. **A tabela `integra_products` mistura dois mundos**: campos de ERP (`matricula`, `fornecedor`, `marca`, `suspensa`, `tipo`, `codigo_fiscal`, `codigo_barra`, `unidade`, `promocao`, `preco_custo`, `last_sync_at`, `sync_status`) com campos de loja (`slug`, `is_active`, `is_featured`, `category`, `platform`, `badge_*`, `uti_pro_price`, `uti_coins_*`). Você não sabe o que pode editar sem quebrar o sync.
2. **O update do admin está desligado por stub**: `ProductContext.updateProduct` e `productApi.updateProductInDatabase` só mostram toast "Gerenciado via ERP" e não gravam nada. Por isso "não dá certo" salvar.
3. **Existem 6+ hooks/managers duplicados** apontando para o mesmo dado (`ProductManager`, `ProductManagerNew`, `ProductManagerOptimized`, `ProductManagerOptimizedNew`, `ProductEasyManager`, `ProductEditor`), cada um com um caminho de escrita diferente.

Decisões alinhadas: ERP **desligado**, tabela renomeada para **`products`**, catálogo 100% gerenciado pelo painel.

---

## Escopo

### Dentro
- Nova tabela `products` limpa, gerenciada pelo admin.
- Migração dos dados atuais de `integra_products` → `products`.
- Um único fluxo CRUD funcional (create / update / delete / list) no admin.
- Um único hook (`useProducts`) e um único contexto (`ProductContext`) usados por todo o app.
- Consolidação: manter **um** ProductManager no admin, remover os outros.
- Preservar visualmente todos os cards e páginas do frontend (só troca a fonte dos dados).

### Fora
- Sistema de busca, tags, seções, favoritos: mantidos como estão, só reapontam para `products`.
- Nada de gateway de pagamento, checkout, UTI Care (assunto separado).
- Nada de reativar sync com IntegraAPI.

---

## Nova Tabela `products`

Campos essenciais (sem ruído do ERP):

```text
id                uuid PK
name              text            -- antes: descricao
slug              text unique
description       text
short_description text
sku               text            -- código interno editável
barcode           text            -- opcional
price             numeric         -- preço cheio
promotional_price numeric         -- opcional
cost_price        numeric         -- opcional, uso interno
stock             integer default 0
image             text            -- imagem principal
additional_images jsonb default '[]'
category          text
platform          text
brand             text
is_active         boolean default true
is_featured       boolean default false
badge_text        text
badge_color       text
badge_visible     boolean default false
uti_pro_enabled   boolean default false
uti_pro_price     numeric
uti_coins_cashback_percentage integer default 0
uti_coins_discount_percentage integer default 0
meta_title        text
meta_description  text
sort_order        integer default 0
created_at, updated_at
```

RLS: leitura pública para produtos `is_active=true`; escrita apenas para admins (via `has_role`).

---

## Migração de Dados

Mapeamento `integra_products` → `products`:

```text
descricao          -> name
foto               -> image
preco_venda        -> price
preco_promocao     -> promotional_price
preco_custo        -> cost_price
saldo_atual        -> stock
grupo/category     -> category
platform           -> platform
badge_*            -> badge_* (idem)
uti_pro_price      -> uti_pro_price
uti_coins_*        -> uti_coins_* (idem)
slug               -> slug (fallback: gerado do name)
is_active          -> is_active (respeitando suspensa='S' -> false)
is_featured        -> is_featured
referencia         -> sku
codigo_barra       -> barcode
```

Descartados (ficam só se você pedir depois): `matricula`, `fornecedor`, `marca` numérico, `tipo`, `codigo_fiscal`, `unidade`, `promocao`, `suspensa`, `last_sync_at`, `sync_status`, `tipo_item`.

Reapontamentos de FK:
- `integra_product_tags.product_id` → `products.id` (renomear tabela para `product_tags` no processo).
- `integra_cart_items.product_id` → `products.id` (renomear para `cart_items`).
- Qualquer `product_sections` / relacionamento já usa `product_id` uuid, então só precisa apontar para a nova tabela.

Tabelas ERP a **remover**: `integra_sync_config`, `integra_sync_log`, e após a migração de dados, `integra_products`.

---

## Consolidação de Código

### Camada de dados (um único caminho)
- `src/hooks/useProducts/productApi.ts` — reescrito para operar em `products`, com `fetch`, `insert`, `update`, `delete` funcionais.
- `src/hooks/useProducts/types.ts` — `Product` alinhado 1:1 com a nova tabela; remover ~40 campos legados nunca usados (SKU master, `variant_attributes`, `inherit_from_master`, etc).
- `src/hooks/useProducts/integraMapper.ts` — **deletado** (não precisamos mais mapear ERP).
- `src/contexts/ProductContext.tsx` — `updateProduct` / `addProduct` / `deleteProduct` deixam de ser stub e passam a chamar a API de verdade.

### Admin (um único manager)
Manter: `src/components/Admin/ProductManager.tsx` + `ProductManager/ProductForm.tsx` (form com abas: básico, mídia, preço, badge, UTI Pro/Coins, SEO).

Deletar (duplicados legados):
- `ProductManagerNew.tsx`, `ProductManagerOptimizedNew.tsx`
- `ProductEasyManager.tsx`
- `ProductManager/ProductFormNew.tsx`, `ProductListNew.tsx`
- `ProductManager/DatabaseHealthMonitor.tsx` (referências a `integra_*`)
- Aba "Produtos Integra" e seus componentes de sync no `AdminPanel`.

### Reapontamentos
Todo arquivo que hoje faz `from('integra_products')` passa a fazer `from('products')`:
- `useProducts.ts`, `useProductDetail.ts`, `useOptimizedProductDetail.ts`, `useProductsPaginated.ts`, `useProductsEnhanced.ts`, `useFavorites.ts`, `useXbox4Data/dataFetchers.ts`, `usePlayStationData/dataFetchers.ts`, `RelatedProductsMobile.tsx`, `FavoritesList.tsx`, `OrderVerifier.tsx`, `SettingsManager.tsx`, edge function `search-weighted`.

Nenhum componente visual de card ou página de produto é reescrito — só a origem dos dados muda.

---

## Ordem de Execução

1. **Migração SQL**: cria `products`, `product_tags`, `cart_items`; copia dados de `integra_products` / `integra_product_tags` / `integra_cart_items`; aplica GRANTs + RLS + trigger `updated_at`.
2. **Reescrever `productApi.ts` + `types.ts`** apontando para `products` com CRUD real.
3. **Restaurar `ProductContext`** (fim dos stubs).
4. **Reapontar hooks/componentes** que ainda leem `integra_products` para `products`.
5. **Reescrever `ProductForm`** para o novo shape (remover campos ERP; garantir save funciona).
6. **Limpar admin**: remover managers duplicados e a aba "Produtos Integra".
7. **Drop das tabelas ERP** (`integra_products`, `integra_product_tags`, `integra_cart_items`, `integra_sync_config`, `integra_sync_log`) após confirmar que o app roda.
8. Verificação: listar produtos na home, abrir um card, editar um produto no admin e confirmar persistência.

---

## Resultado Esperado

- Uma única tabela `products` com só o que importa para a loja.
- Botão "Salvar" do admin funciona de verdade.
- Zero código de sincronização/ERP no repositório.
- Cards, páginas de produto, busca, favoritos e carrinho continuam funcionando visualmente idênticos.
