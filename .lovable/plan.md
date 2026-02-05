
# Plano: Corrigir Erros de Build Restantes (Fase Final)

## Resumo Executivo

Os **cards de produto foram 100% preservados** ✅. O problema atual são arquivos auxiliares que ainda referenciam tabelas deletadas. Precisamos criar stubs ou adaptar esses arquivos para usar `integra_products`.

---

## Diagnóstico: O Que Foi Preservado

| Componente | Status |
|------------|--------|
| `ProductCard.tsx` | ✅ Intacto |
| `ProductCardImage.tsx` | ✅ Intacto |
| `ProductCardInfo.tsx` | ✅ Intacto |
| `ProductCardPrice.tsx` | ✅ Intacto |
| `ProductCardBadge.tsx` | ✅ Intacto |
| `ProductCardProPrice.tsx` | ✅ Intacto |
| `ProductCardStock.tsx` | ✅ Intacto |
| `productApi.ts` (mapper) | ✅ Adaptado para integra_products |

---

## Erros Restantes por Categoria

### Categoria 1: Tabelas Deletadas (Precisam de Stubs)

| Arquivo | Tabela Referenciada | Solução |
|---------|---------------------|---------|
| `useCartPersistence.ts` | `cart_items` | Usar apenas localStorage |
| `useCartSync.ts` | `cart_items` | Usar apenas localStorage |
| `useProductFAQs.ts` | `product_faqs` | Retornar FAQs mock |
| `ProductFAQ.tsx` | `products.product_faqs` | Usar FAQs mock |
| `ProductManagerNew.tsx` | `product_specifications`, `product_faqs` | Remover inserções |
| `ProductManagerOptimizedNew.tsx` | `product_specifications`, `product_faqs` | Remover inserções |

### Categoria 2: Views Deletadas

| Arquivo | View Referenciada | Solução |
|---------|-------------------|---------|
| `useProductDetail.ts` | `view_product_with_tags` | Usar `integra_products` direto |
| `useOptimizedProductDetail.ts` | `view_product_with_tags` | Usar `integra_products` direto |
| `dataFetchers.ts` | `view_product_with_tags` | Usar `integra_products` direto |

### Categoria 3: Outros

| Arquivo | Problema | Solução |
|---------|----------|---------|
| `ProductContext.tsx` | Funções add/update/delete usam stubs | Ajustar para não tentar CRUD |
| `FavoritesList.tsx` | Referencia `products` | Usar `integra_products` |
| `RelatedProductsMobile.tsx` | Referencia `products` | Usar `integra_products` |
| `ProductTabsEnhanced.tsx` | Referencia `products` | Usar `integra_products` |
| `ProductTabsMobile.backup.tsx` | Referencia `products` | Deletar arquivo backup |

---

## Fase 1: Criar Stubs para Hooks de Carrinho

### 1.1 useCartPersistence.ts
Adaptar para usar APENAS localStorage (sem banco):

```text
// Remover todas as referências a supabase.from('cart_items')
// Manter apenas loadFromLocalStorage e saveToLocalStorage
// loadFromDatabase retorna array vazio
// saveToDatabase apenas chama saveToLocalStorage
```

### 1.2 useCartSync.ts
Mesmo tratamento - remover referências a `cart_items`.

---

## Fase 2: Criar Stub para FAQs

### 2.1 useProductFAQs.ts
Transformar em stub que retorna FAQs mock:

```text
export const useProductFAQs = (productId: string) => {
  const mockFaqs = [
    { id: '1', question: 'O jogo vem lacrado?', answer: 'Sim, todos originais.' },
    { id: '2', question: 'Qual prazo de entrega?', answer: '2-5 dias úteis.' },
    // ... mais FAQs padrão
  ];
  
  return {
    faqs: mockFaqs,
    categorizedFaqs: [{ category: 'Geral', faqs: mockFaqs }],
    loading: false,
    // Funções stub
    addFAQ: async () => ({ success: false }),
    updateFAQ: async () => ({ success: false }),
    deleteFAQ: async () => ({ success: false }),
    incrementHelpfulCount: async () => ({ success: false }),
    refreshFAQs: async () => {},
  };
};
```

### 2.2 ProductFAQ.tsx
Remover query ao banco, usar apenas FAQs mock.

---

## Fase 3: Adaptar useProductDetail.ts

### 3.1 Remover Referência a view_product_with_tags
A função `fetchSKUNavigationOptimized` usa `view_product_with_tags`. Como o sistema de SKUs foi simplificado, podemos:

1. Remover a busca de navegação de SKUs (produtos do ERP são simples)
2. Ou adaptar para usar `integra_products` diretamente

---

## Fase 4: Corrigir ProductContext.tsx

### 4.1 Ajustar Funções CRUD
As funções `addProduct`, `updateProduct`, `deleteProduct` chamam stubs que lançam erro. Precisamos:

1. Fazer essas funções retornarem silenciosamente (ou mostrar toast informando que CRUD é via ERP)
2. Manter apenas `fetchProducts` funcionando

---

## Fase 5: Corrigir Componentes de Produto

### 5.1 FavoritesList.tsx
Mudar query de `products` para `integra_products`.

### 5.2 RelatedProductsMobile.tsx
Mudar query de `products` para `integra_products`.

### 5.3 ProductTabsEnhanced.tsx
Mudar query de `products` para `integra_products`.

### 5.4 ProductTabsMobile.backup.tsx
Deletar arquivo (é backup, não usado).

---

## Fase 6: Limpar Admin Managers

### 6.1 ProductManagerNew.tsx
Remover código que insere em `product_specifications` e `product_faqs`.

### 6.2 ProductManagerOptimizedNew.tsx
Mesmo tratamento.

---

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/hooks/useCartPersistence.ts` | Remover referências a cart_items |
| `src/hooks/useCartSync.ts` | Remover referências a cart_items |
| `src/hooks/useProductFAQs.ts` | Transformar em stub com mock |
| `src/hooks/useProductDetail.ts` | Adaptar para integra_products |
| `src/hooks/useOptimizedProductDetail.ts` | Adaptar para integra_products |
| `src/hooks/usePlayStationData/dataFetchers.ts` | Adaptar para integra_products |
| `src/contexts/ProductContext.tsx` | Ajustar funções CRUD |
| `src/components/Product/ProductFAQ.tsx` | Usar apenas mock FAQs |
| `src/components/Product/ProductTabsEnhanced.tsx` | Adaptar para integra_products |
| `src/components/Product/Mobile/RelatedProductsMobile.tsx` | Adaptar para integra_products |
| `src/components/Profile/FavoritesList.tsx` | Adaptar para integra_products |
| `src/components/Admin/ProductManagerNew.tsx` | Remover inserções em tabelas deletadas |
| `src/components/Admin/ProductManager/ProductManagerOptimizedNew.tsx` | Remover inserções em tabelas deletadas |

## Arquivos a Deletar

| Arquivo | Motivo |
|---------|--------|
| `src/components/Product/Mobile/ProductTabsMobile.backup.tsx` | Arquivo backup obsoleto |

---

## Ordem de Execução

1. Corrigir hooks de carrinho (useCartPersistence, useCartSync)
2. Criar stub para useProductFAQs
3. Corrigir ProductFAQ.tsx
4. Adaptar useProductDetail.ts e relacionados
5. Corrigir ProductContext.tsx
6. Adaptar componentes (FavoritesList, RelatedProducts, etc)
7. Limpar Admin Managers
8. Deletar arquivo backup
9. Testar compilação

---

## Resultado Esperado

- ✅ 0 erros de build
- ✅ Cards de produto funcionando normalmente
- ✅ Dados vindos de integra_products
- ✅ Carrinho funcionando via localStorage
- ✅ FAQs usando dados mock
