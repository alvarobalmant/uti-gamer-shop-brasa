
## Plano: Adaptar Frontend para Nova Estrutura IntegraAPI

### Contexto
O banco de dados foi migrado de `products` para `integra_products` com campos diferentes. Os componentes visuais (cards, etc) devem ser MANTIDOS e ADAPTADOS, nao deletados.

---

## Problema Atual

### Estrutura Antiga (products)
| Campo | Tipo |
|-------|------|
| name | TEXT |
| price | DECIMAL |
| list_price | DECIMAL |
| pro_price | DECIMAL |
| image | TEXT |
| stock | INTEGER |
| badge_visible | BOOLEAN |

### Estrutura Nova (integra_products)
| Campo ERP | Campo Site | Tipo |
|-----------|------------|------|
| descricao | → name | TEXT |
| preco_venda | → price | DECIMAL |
| preco_promocao | → list_price | DECIMAL |
| uti_pro_price | → pro_price | DECIMAL |
| foto | → image | TEXT |
| saldo_atual | → stock | DECIMAL |
| (novo campo) | badge_visible | BOOLEAN (falta) |

---

## Fase 1: Adicionar Campo Faltante no Banco

### 1.1 Migration SQL
Adicionar `badge_visible` na tabela `integra_products`:

```text
ALTER TABLE integra_products 
ADD COLUMN badge_visible BOOLEAN DEFAULT false;
```

---

## Fase 2: Atualizar Interface Product (types.ts)

### 2.1 Manter Campos Antigos como Aliases
O type `Product` deve continuar tendo os mesmos campos que os componentes esperam (`name`, `price`, `image`, etc) para nao quebrar nada.

Os hooks de busca farao o mapeamento:
- `descricao` → `name`
- `preco_venda` → `price`
- `preco_promocao` → `promotional_price`/`list_price`
- `foto` → `image`
- `saldo_atual` → `stock`

---

## Fase 3: Atualizar productApi.ts

### 3.1 Buscar de integra_products
Alterar todas as queries de `products` para `integra_products`.

### 3.2 Mapeamento de Campos
```text
const mapIntegraToProduct = (row: any): Product => ({
  id: row.id,
  name: row.descricao,           // ERP → Frontend
  price: row.preco_venda,        // ERP → Frontend  
  image: row.foto,               // ERP → Frontend
  stock: row.saldo_atual,        // ERP → Frontend
  promotional_price: row.preco_promocao,
  slug: row.slug,
  badge_text: row.badge_text,
  badge_color: row.badge_color,
  badge_visible: row.badge_visible ?? false,
  is_active: row.is_active,
  is_featured: row.is_featured,
  category: row.category,
  platform: row.platform,
  pro_price: row.uti_pro_price,
  uti_coins_cashback_percentage: row.uti_coins_cashback_percentage,
  uti_coins_discount_percentage: row.uti_coins_discount_percentage,
  created_at: row.created_at,
  updated_at: row.updated_at,
  // Campos extras nao presentes no ERP
  list_price: row.preco_promocao || row.preco_venda,
  description: row.descricao,
  tags: [],
});
```

---

## Fase 4: Atualizar productApiOptimized.ts

### 4.1 Mesma Logica de Mapeamento
Alterar queries para `integra_products` e usar mesma funcao de mapeamento.

---

## Fase 5: Atualizar useFavorites.ts

### 5.1 Mudar JOIN para integra_products
A query de favoritos faz join com `products`, precisa mudar para `integra_products`:

```text
.from('user_favorites')
.select(`
  id,
  user_id,
  product_id,
  created_at,
  product:integra_products (
    id,
    descricao,
    preco_venda,
    foto,
    slug,
    preco_promocao,
    uti_pro_price
  )
`)
```

E mapear os campos na resposta.

---

## Fase 6: Atualizar useProductSpecifications.ts

### 6.1 Criar Stub ou Adaptar
A tabela `product_specifications` foi deletada. Opcoes:
- Criar stub vazio que retorna array vazio
- Usar campo JSON em `integra_products` para especificacoes

Recomendo criar stub que retorna vazio ate termos especificacoes no ERP.

---

## Fase 7: Verificar Componentes que Usam Campos Especificos

### 7.1 ProductCardBadge.tsx
Usa: `badge_text`, `badge_color`, `badge_visible`
Acao: Campos existem em `integra_products`, OK.

### 7.2 ProductCardPrice.tsx
Usa: `price`, `list_price`, `pro_price`
Acao: Mapeamento garante esses campos.

### 7.3 ProductCardImage.tsx
Usa: `image`, `name`
Acao: Mapeamento garante esses campos.

### 7.4 ProductCardInfo.tsx
Usa: `name`
Acao: Mapeamento garante esse campo.

### 7.5 FavoriteButton.tsx
Usa: `useFavorites` hook
Acao: Atualizar hook (Fase 5).

---

## Fase 8: Arquivos a Modificar

| Arquivo | Acao |
|---------|------|
| `src/hooks/useProducts/types.ts` | Manter interface, adicionar campos ERP como opcionais |
| `src/hooks/useProducts/productApi.ts` | Mudar para integra_products + mapeamento |
| `src/hooks/useProducts/productApiOptimized.ts` | Mudar para integra_products + mapeamento |
| `src/hooks/useFavorites.ts` | Mudar JOIN para integra_products |
| `src/hooks/useProductSpecifications.ts` | Criar stub vazio |
| `src/contexts/ProductContext.tsx` | Nenhuma mudanca (usa productApi) |
| `src/contexts/ProductContextOptimized.tsx` | Nenhuma mudanca (usa productApiOptimized) |

---

## Fase 9: Arquivos que NAO Precisam Mudar

| Arquivo | Motivo |
|---------|--------|
| `src/components/ProductCard.tsx` | Usa interface Product normalizada |
| `src/components/ProductCard/*.tsx` | Usam interface Product normalizada |
| `src/components/Xbox4/ProductCard.tsx` | Usa interface Product normalizada |
| Todos componentes de UI | Dependem da interface, nao do banco |

---

## Ordem de Execucao

1. Adicionar campo `badge_visible` na tabela `integra_products`
2. Atualizar `productApi.ts` com funcao de mapeamento
3. Atualizar `productApiOptimized.ts` com funcao de mapeamento
4. Atualizar `useFavorites.ts` para usar `integra_products`
5. Criar stub para `useProductSpecifications.ts`
6. Testar compilacao
7. Verificar funcionamento dos cards

---

## Secao Tecnica

### Funcao de Mapeamento Central

Criar arquivo `src/hooks/useProducts/integraMapper.ts`:

```text
import { Product } from './types';

export const mapIntegraRowToProduct = (row: any): Product => {
  return {
    // IDs
    id: row.id,
    
    // Campos mapeados do ERP
    name: row.descricao || '',
    description: row.descricao || '',
    price: Number(row.preco_venda) || 0,
    image: row.foto || '',
    stock: Number(row.saldo_atual) || 0,
    
    // Campos promocionais
    list_price: row.preco_promocao ? Number(row.preco_promocao) : undefined,
    promotional_price: row.preco_promocao ? Number(row.preco_promocao) : undefined,
    
    // Campos do site
    slug: row.slug || '',
    category: row.category || '',
    platform: row.platform || '',
    is_active: row.is_active !== false,
    is_featured: row.is_featured || false,
    
    // Badges
    badge_text: row.badge_text || '',
    badge_color: row.badge_color || '#22c55e',
    badge_visible: row.badge_visible || false,
    
    // Precos especiais
    pro_price: row.uti_pro_price ? Number(row.uti_pro_price) : undefined,
    uti_pro_price: row.uti_pro_price ? Number(row.uti_pro_price) : undefined,
    
    // UTI Coins
    uti_coins_cashback_percentage: row.uti_coins_cashback_percentage || 0,
    uti_coins_discount_percentage: row.uti_coins_discount_percentage || 0,
    
    // Timestamps
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
    
    // Campos extras vazios (compatibilidade)
    tags: [],
    additional_images: [],
    sizes: [],
    colors: [],
  };
};
```

### Campos que Precisam ser Adicionados ao Banco

| Campo | Tipo | Default | Motivo |
|-------|------|---------|--------|
| badge_visible | BOOLEAN | false | Cards usam esse campo |

Campos que JA EXISTEM e funcionam:
- badge_text ✓
- badge_color ✓
- slug ✓
- category ✓
- platform ✓
- is_active ✓
- is_featured ✓
- uti_pro_price ✓
- uti_coins_cashback_percentage ✓
- uti_coins_discount_percentage ✓
