

## Plano: Limpeza Radical e Reconstrucao do Sistema de Produtos com Integracao IntegraAPI

### Objetivo
Apagar TUDO relacionado a produtos, busca e cadastro atual. Reconstruir do zero baseado na estrutura da IntegraAPI (Atual Sistemas), com uma nova pagina "Produtos Integra" no painel admin.

---

## Fase 1: Limpeza do Banco de Dados

### 1.1 Tabelas a DELETAR Completamente

| Tabela | Registros | Motivo |
|--------|-----------|--------|
| `products` | 735 | Recriar do zero com estrutura da API |
| `product_tags` | 7.209 | Sistema de tags sera simplificado |
| `tags` | 2.753 | Recriar com estrutura limpa |
| `product_analytics` | - | Dados antigos, recriar |
| `product_faqs` | - | Dados antigos |
| `product_specifications` | - | Recriar estrutura |

### 1.2 Views a DELETAR

| View | Motivo |
|------|--------|
| `view_product_with_tags` | Estrutura antiga |
| `view_products_search` | Estrutura antiga |

### 1.3 Funcoes RPC a DELETAR

| Funcao | Motivo |
|--------|--------|
| `search_products_enhanced` | Sistema de busca antigo |
| `search_products_weighted` | Sistema de pesos antigo |
| `get_products_with_tags_corrected` | Estrutura antiga |
| `get_product_intelligence` | Nao sera usado |
| `diagnose_product_data` | Debug antigo |
| `validate_product_integrity` | Estrutura antiga |

---

## Fase 2: Nova Estrutura do Banco de Dados

### 2.1 Nova Tabela `integra_products` (Principal)

Estrutura baseada na API IntegraAPI (cadpro + estsal):

```sql
CREATE TABLE integra_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Campos da IntegraAPI (cadpro)
  matricula INTEGER UNIQUE NOT NULL,  -- ID unico no ERP
  tipo VARCHAR(1),                     -- Tipo do produto
  fornecedor INTEGER,                  -- Codigo fornecedor
  marca INTEGER,                       -- Codigo marca
  grupo VARCHAR(10),                   -- Codigo grupo
  descricao TEXT NOT NULL,             -- Nome do produto
  referencia VARCHAR(50),              -- Referencia
  unidade VARCHAR(5) DEFAULT 'UN',     -- Unidade
  codigo_fiscal VARCHAR(20),           -- NCM
  codigo_barra VARCHAR(50),            -- Codigo de barras
  suspensa VARCHAR(1) DEFAULT 'N',     -- Suspenso S/N
  tipo_item VARCHAR(5),                -- Tipo item
  foto TEXT,                           -- Imagem (base64 ou URL)
  
  -- Campos da IntegraAPI (estsal)
  saldo_atual DECIMAL(10,4) DEFAULT 0, -- Estoque
  preco_venda DECIMAL(12,2),           -- Preco de venda
  preco_custo DECIMAL(12,2),           -- Preco de custo
  promocao VARCHAR(1) DEFAULT 'N',     -- Em promocao S/N
  preco_promocao DECIMAL(12,2),        -- Preco promocional
  
  -- Campos extras para o site (nao vem da API)
  slug VARCHAR(255) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  category VARCHAR(100),               -- Categoria no site
  platform VARCHAR(50),                -- Plataforma (PS5, Xbox, etc)
  badge_text VARCHAR(50),
  badge_color VARCHAR(20),
  
  -- Precos especiais do site
  uti_pro_price DECIMAL(12,2),
  uti_coins_cashback_percentage INTEGER DEFAULT 0,
  uti_coins_discount_percentage INTEGER DEFAULT 0,
  
  -- Sincronizacao
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status VARCHAR(20) DEFAULT 'pending',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.2 Nova Tabela `integra_tags` (Simplificada)

```sql
CREATE TABLE integra_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,  -- 'plataforma', 'genero', 'tipo', 'marca'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.3 Nova Tabela `integra_product_tags`

```sql
CREATE TABLE integra_product_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES integra_products(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES integra_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, tag_id)
);
```

### 2.4 Nova Tabela `integra_sync_config`

```sql
CREATE TABLE integra_sync_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_url TEXT NOT NULL,              -- http://DOMINIO:2091
  cnpj VARCHAR(20) NOT NULL,
  funcionario INTEGER NOT NULL,
  current_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  last_products_sync TIMESTAMP WITH TIME ZONE,
  last_stock_sync TIMESTAMP WITH TIME ZONE,
  sync_interval_minutes INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.5 Nova Tabela `integra_sync_log`

```sql
CREATE TABLE integra_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type VARCHAR(50),  -- 'products', 'stock', 'orders', 'customers'
  status VARCHAR(20),     -- 'success', 'error', 'partial'
  records_processed INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_message TEXT,
  details JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);
```

---

## Fase 3: Limpeza de Arquivos Frontend

### 3.1 Paginas de Busca a DELETAR (5 arquivos)

| Arquivo | Motivo |
|---------|--------|
| `src/pages/SearchResults.tsx` | Duplicado |
| `src/pages/SearchResultsEnhanced.tsx` | Duplicado |
| `src/pages/SearchResultsFinal.tsx` | Duplicado |
| `src/pages/SearchResultsPerfect.tsx` | Duplicado |
| `src/pages/SearchResultsWeighted.tsx` | Duplicado |

Manter apenas: `src/pages/UnifiedResultsPage.tsx`

### 3.2 Componentes de Debug a DELETAR

| Arquivo | Motivo |
|---------|--------|
| `src/components/Debug/TokenCompatibilityDebug.tsx` | Debug antigo |
| `src/components/Debug/SearchDebugPanel.tsx` | Debug antigo |
| `src/components/Debug/AlgorithmComparisonDemo.tsx` | Debug antigo |

### 3.3 Utils de Busca a DELETAR/SIMPLIFICAR

| Arquivo | Acao |
|---------|------|
| `src/utils/tokenCompatibilitySearch.ts` | Recriar simplificado |
| `src/utils/tokenClassification.ts` | Deletar |
| `src/utils/fuzzySearch.ts` | Manter e simplificar |
| `src/utils/multiTagSearch.ts` | Deletar |
| `src/utils/smartSearch.ts` | Deletar |
| `src/utils/advancedSpellChecker.ts` | Deletar |
| `src/utils/advancedSpellCorrector.ts` | Deletar |
| `src/utils/robustSpellChecker.ts` | Deletar |
| `src/utils/intelligentSpellChecker.ts` | Deletar |
| `src/utils/spellChecker.ts` | Deletar |

### 3.4 Hooks de Produtos a REFATORAR

| Arquivo | Acao |
|---------|------|
| `src/hooks/useProducts.ts` | Recriar para integra_products |
| `src/hooks/useProductsEnhanced.ts` | Deletar |
| `src/hooks/useWeightedSearch.ts` | Recriar simplificado |
| `src/hooks/useProducts/productApi.ts` | Recriar |
| `src/hooks/useProducts/types.ts` | Recriar |

### 3.5 Componentes Admin de Produtos a DELETAR

| Arquivo/Pasta | Motivo |
|---------------|--------|
| `src/components/Admin/ProductManager/` | Recriar do zero |
| `src/components/Admin/ProductManagerNew.tsx` | Duplicado |
| `src/components/Admin/ProductEasyManager.tsx` | Duplicado |
| `src/components/Admin/BulkProductUpload.tsx` | Recriar |
| `src/components/Admin/MasterProductManager.tsx` | Sistema SKU antigo |
| `src/components/Admin/TagManager.tsx` | Recriar simplificado |

---

## Fase 4: Novos Arquivos a Criar

### 4.1 Edge Function para IntegraAPI

**Arquivo:** `supabase/functions/integra-api/index.ts`

Funcionalidades:
- `authenticate()` - Login e obter token JWT
- `refreshToken()` - Renovar token antes de expirar
- `fetchProducts()` - Buscar produtos da API (cadpro)
- `fetchStock()` - Buscar estoque da API (estsal)
- `syncProducts()` - Sincronizar produtos com Supabase
- `createOrder()` - Enviar pedido para ERP (/api/Venda/Gravar)
- `syncCustomer()` - Sincronizar cliente (/api/CadCliente/Gravar)

### 4.2 Nova Pagina Admin: Produtos Integra

**Arquivo:** `src/pages/Admin/IntegraProductsManager.tsx`

Secoes:
1. **Configuracao API** - URL, CNPJ, Funcionario, Senha
2. **Status de Sincronizacao** - Ultima sync, proximo sync, status
3. **Botoes de Acao** - Sincronizar Produtos, Sincronizar Estoque
4. **Lista de Produtos** - Tabela com produtos sincronizados
5. **Logs de Sincronizacao** - Historico de syncs

### 4.3 Novo Sistema de Busca Simplificado

**Arquivo:** `src/utils/searchProductsSimple.ts`

```typescript
// Busca simples e direta
export const searchProducts = (products: Product[], query: string) => {
  const normalizedQuery = query.toLowerCase().trim();
  const tokens = normalizedQuery.split(/\s+/);
  
  return products
    .map(product => {
      let score = 0;
      
      // Match no nome (peso 100)
      const name = product.descricao.toLowerCase();
      tokens.forEach(token => {
        if (name.includes(token)) score += 100;
      });
      
      // Match na categoria (peso 50)
      if (product.category?.toLowerCase().includes(normalizedQuery)) {
        score += 50;
      }
      
      // Match na plataforma (peso 30)
      if (product.platform?.toLowerCase().includes(normalizedQuery)) {
        score += 30;
      }
      
      return { ...product, relevance_score: score };
    })
    .filter(p => p.relevance_score > 0)
    .sort((a, b) => b.relevance_score - a.relevance_score);
};
```

### 4.4 Hook de Sincronizacao

**Arquivo:** `src/hooks/useIntegraSync.ts`

- Gerenciar estado de sincronizacao
- Chamar Edge Function
- Atualizar UI em tempo real
- Tratar erros

### 4.5 Novo Hook de Produtos

**Arquivo:** `src/hooks/useIntegraProducts.ts`

- Buscar produtos de `integra_products`
- Cache otimizado
- Filtros por categoria/plataforma

---

## Fase 5: Atualizacao do AdminPanel

Adicionar nova aba "PRODUTOS INTEGRA" no menu:

```typescript
const menuItems = [
  // ... itens existentes ...
  { id: 'integra_products', label: 'PRODUTOS INTEGRA', icon: RefreshCw },
  // Remover:
  // - 'products' (antigo)
  // - 'bulk_upload' (antigo)
  // - 'backup_edit' (antigo)
  // - 'skus' (antigo)
  // - 'tags' (antigo)
];
```

---

## Fase 6: Fluxo de Sincronizacao

### 6.1 Fluxo de Importacao de Produtos

```text
1. Admin configura API (URL, CNPJ, Funcionario, Senha)
2. Sistema autentica e obtem token JWT
3. Busca produtos via /api/cadpro (paginado, 500 por vez)
4. Para cada produto:
   - Normaliza dados (descricao, referencia, codigo_barra)
   - Gera slug unico do nome
   - Busca preco/estoque via /api/estsal
   - Insere/atualiza em integra_products
5. Registra log de sincronizacao
6. Agenda proxima sync automatica (cron)
```

### 6.2 Fluxo de Sincronizacao de Estoque

```text
1. Cron job executa a cada X minutos
2. Busca /api/estsal para todos os produtos
3. Atualiza saldo_atual, preco_venda, promocao em integra_products
4. Registra log
```

### 6.3 Fluxo de Envio de Pedido

```text
1. Cliente finaliza compra no site
2. Sistema verifica/cria cliente via /api/CadCliente/Gravar
3. Monta estrutura estmov + estimo
4. Envia para /api/Venda/Gravar
5. Recebe pedido/serie do ERP
6. Atualiza pedido local com dados do ERP
```

---

## Resumo de Impacto

### Arquivos a DELETAR

| Categoria | Quantidade |
|-----------|------------|
| Paginas de busca duplicadas | 5 |
| Componentes de debug | 3 |
| Utils de busca/spell | 10+ |
| Componentes admin antigos | 15+ |
| Hooks antigos | 5+ |

### Tabelas a DELETAR

| Tabela | Registros |
|--------|-----------|
| products | 735 |
| tags | 2.753 |
| product_tags | 7.209 |
| product_analytics | - |
| product_faqs | - |
| product_specifications | - |

### Arquivos a CRIAR

| Arquivo | Funcao |
|---------|--------|
| `supabase/functions/integra-api/index.ts` | Edge Function |
| `src/pages/Admin/IntegraProductsManager.tsx` | Nova pagina admin |
| `src/utils/searchProductsSimple.ts` | Nova busca |
| `src/hooks/useIntegraProducts.ts` | Novo hook produtos |
| `src/hooks/useIntegraSync.ts` | Hook de sync |

---

## Secao Tecnica

### Estrutura JWT da IntegraAPI

```json
{
  "role": "api",
  "Isadmin": true,
  "Agent": "ABCD123456789",
  "Filial": 1,
  "Func": 1,
  "Empresa": "04065234000178",
  "iss": "Atual Sistemas",
  "exp": 1547164800  // Timestamp de expiracao
}
```

Token expira em 60 dias. Renovar via GET `/api/LogarService/NovoToken`.

### Endpoints Principais da IntegraAPI

| Endpoint | Metodo | Funcao |
|----------|--------|--------|
| `/api/LogarService/LogarCNPJ` | POST | Login |
| `/api/LogarService/NovoToken` | GET | Renovar token |
| `/api/cadpro` | GET | Listar produtos |
| `/api/cadpro(matricula)` | GET | Produto especifico |
| `/api/estsal` | GET | Saldo de estoque |
| `/api/CadCliente/Gravar` | POST | Cadastrar cliente |
| `/api/Venda/Gravar` | POST | Registrar venda |

### Paginacao da API

```text
/api/cadpro/?$top=500&$skip=0&$inlinecount=allpages

$top = limite de registros
$skip = offset (pagina * $top)
$inlinecount = retorna total de registros
```

### Ordem de Execucao

1. Executar SQL de limpeza (deletar tabelas antigas)
2. Executar SQL de criacao (novas tabelas)
3. Deletar arquivos frontend antigos
4. Criar Edge Function
5. Criar nova pagina admin
6. Criar novos hooks
7. Atualizar AdminPanel
8. Criar nova busca simplificada
9. Atualizar UnifiedResultsPage
10. Testar sincronizacao

