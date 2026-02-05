
# Plano: Adicionar Produtos de Teste e Corrigir Erros Restantes

## Resumo

Vamos inserir produtos de teste na tabela `integra_products` para visualizar os cards funcionando, e em paralelo corrigir os erros de build restantes nos componentes de admin.

---

## Fase 1: Inserir Produtos de Teste

### 1.1 Estrutura dos Dados
Vou inserir 9 produtos de teste variados (jogos PS5, Xbox, Nintendo, acessórios):

| Campo | Descrição |
|-------|-----------|
| `matricula` | ID numérico sequencial (1001-1009) |
| `descricao` | Nome do produto |
| `grupo` | Categoria (Jogos, Acessórios) |
| `platform` | Plataforma (PS5, Xbox, Switch, PC) |
| `foto` | URL de imagem do Unsplash |
| `preco_venda` | Preço normal |
| `preco_promocao` | Preço promocional (alguns produtos) |
| `saldo_atual` | Estoque |
| `badge_text` / `badge_color` | Badges visuais |
| `is_active` | true |

### 1.2 Produtos a Inserir

```text
1. God of War Ragnarök - PS5          R$ 249,90 (estoque: 15)
2. Spider-Man 2 - PS5                 R$ 299,90 → R$ 229,90 (PROMOÇÃO)
3. Halo Infinite - Xbox               R$ 179,90 (estoque: 8)
4. Forza Horizon 5 - Xbox             R$ 199,90 (estoque: 12)
5. Zelda: Tears of the Kingdom        R$ 349,90 (estoque: 20)
6. Mario Kart 8 Deluxe - Switch       R$ 279,90 (estoque: 25)
7. DualSense Controller - PS5         R$ 449,90 (estoque: 30)
8. Xbox Elite Controller Series 2     R$ 899,90 → R$ 749,90 (PROMOÇÃO)
9. Cyberpunk 2077 - PC                R$ 149,90 (estoque: 0, ESGOTADO)
```

---

## Fase 2: Corrigir Erros de Build

### 2.1 Componentes Admin a Corrigir

| Arquivo | Problema | Solução |
|---------|----------|---------|
| `MasterProductManager.tsx` | Usa `useSKUs` com argumentos | Deletar (SKUs via ERP) |
| `SKUManager.tsx` | Usa `useSKUs` com argumentos | Deletar (SKUs via ERP) |
| `TagManager.tsx` | Usa `useTags` com argumentos | Adaptar para `integra_tags` |
| `DatabaseHealthMonitor.tsx` | Interface incorreta | Corrigir interface `DatabaseHealth` |
| `ProductFormTabs.tsx` | Props incorretas no FAQTab | Ajustar props do stub |
| `SpecificationDiagnosticPanel.tsx` | Usa Promise incorretamente | Usar await no resultado |
| `ProductContextOptimized.tsx` | Argumentos incorretos | Ajustar chamadas |
| `ProductDesktopManager.tsx` | Referencia tabela `products` | Usar `integra_products` |
| `ProductImageManager.tsx` | Funções inexistentes | Ajustar para usar stubs |

### 2.2 Arquivos a Deletar (Obsoletos)
Estes arquivos gerenciam funcionalidades que agora são centralizadas no ERP:

```text
- src/components/Admin/MasterProductManager.tsx
- src/components/Admin/SKUManager.tsx
- src/components/Admin/SpecificationDiagnosticPanel.tsx
- src/pages/Admin/ProductDesktopManager.tsx
- src/pages/Admin/ProductImageManager.tsx
```

### 2.3 Arquivos a Corrigir

```text
- src/components/Admin/TagManager.tsx → Adaptar para integra_tags
- src/components/Admin/ProductManager/DatabaseHealthMonitor.tsx → Corrigir interface
- src/components/Admin/ProductManager/ProductFormTabs.tsx → Ajustar FAQTab
- src/contexts/ProductContextOptimized.tsx → Corrigir chamadas
```

---

## Fase 3: Atualizar AdminPanel

Remover tabs obsoletas do painel admin:

```text
Tabs a MANTER:
- Gerenciador de Produtos (básico)
- Tags (adaptado)
- Configurações
- Pedidos

Tabs a REMOVER:
- SKUs
- Master Products
- Diagnóstico de Especificações
- Desktop Manager
- Image Manager
```

---

## Ordem de Execução

1. Inserir 9 produtos de teste no banco
2. Deletar arquivos admin obsoletos
3. Corrigir TagManager para usar integra_tags
4. Corrigir DatabaseHealthMonitor
5. Corrigir ProductFormTabs
6. Corrigir ProductContextOptimized
7. Atualizar AdminPanel removendo tabs deletadas
8. Testar compilação

---

## Resultado Esperado

- ✅ 9 produtos visíveis nos cards
- ✅ 0 erros de build
- ✅ Admin simplificado (gestão via ERP)
- ✅ Cards funcionando com dados de integra_products
