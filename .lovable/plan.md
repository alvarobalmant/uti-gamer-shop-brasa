## Diagnóstico

O admin de produtos (aba "Produtos" do painel) é renderizado por `ProductManagerOptimizedNew`, que consome `useProductsPaginated`, que por sua vez repassa `addProduct` / `updateProduct` / `deleteProduct` de `src/hooks/useProducts.ts`.

Neste arquivo, essas três funções ainda estão como **stubs** deixados do tempo do IntegraAPI: mostram o toast "Gerenciado via ERP" e retornam `null` — nunca chamam o Supabase. Por isso o formulário "salva com sucesso" na UI mas o preço no banco não muda.

O `ProductContext` já foi corrigido em turno anterior e chama `productApi` de verdade, mas o admin **não usa o context** — usa o hook direto, que continua stub.

## Correção

Substituir os três stubs em `src/hooks/useProducts.ts` por chamadas reais à API já existente em `src/hooks/useProducts/productApi.ts`, mantendo o mesmo shape de retorno que os componentes esperam.

### `updateProduct`
- Chamar `updateProductInDatabase(id, updates)`.
- Atualizar `products` state local com o produto retornado (`prev.map(p => p.id === id ? updated : p)`).
- Toast de sucesso com o nome, toast de erro no catch.

### `addProduct`
- Chamar `addProductToDatabase(productData)`.
- Fazer prepend no state local (`[created, ...prev]`).
- Toasts equivalentes.

### `deleteProduct`
- Chamar `deleteProductFromDatabase(id)`.
- Remover do state local (`prev.filter(p => p.id !== id)`).
- Toasts equivalentes.

Nada mais precisa mudar: `productApi.ts`, `ProductManagerOptimizedNew`, `ProductForm` e `useProductsPaginated` já estão prontos para receber o resultado real.

## Verificação

1. Recarregar o admin, editar o preço do DualShock 4, salvar.
2. Rodar `SELECT id, name, price FROM products WHERE name ILIKE '%DualShock 4%'` para confirmar que o valor persistiu.
3. Recarregar a home e o card deve refletir o novo preço.
