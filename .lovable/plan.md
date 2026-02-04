

## Plano de Limpeza do Banco de Dados - UTI Games

### Contexto
Você identificou corretamente que há tabelas no banco de dados que não são mais necessárias. A análise revela que o sistema de UTI Coins evoluiu para usar desconto diretamente nos produtos (`uti_coins_discount_percentage`), tornando a "loja de recompensas" (`coin_products`) obsoleta.

---

## Análise Completa das Tabelas

### GRUPO 1 - Tabelas para REMOVER (Sistema de Loja de Coins - Obsoleto)

| Tabela | Registros | Motivo para Remover |
|--------|-----------|---------------------|
| `coin_products` | 1 | Sistema substituído por desconto direto nos produtos |
| `coin_redemptions` | 13 | Dependente de coin_products (legado) |
| `redemption_codes` | 12 | Códigos de resgate do sistema antigo |

**Páginas/Código que serão removidos:**
- `src/pages/CoinsShop.tsx` - Loja de coins legado
- `src/pages/RedemptionHistory.tsx` - Histórico de resgates legado
- `src/components/Retention/RedemptionModal.tsx`
- `src/components/Retention/RedemptionHistoryModal.tsx`
- Seção do admin: `UTICoinsManager.tsx` (parte de produtos)

---

### GRUPO 2 - Tabelas BACKUP para REMOVER (Dados temporários)

| Tabela | Registros | Motivo para Remover |
|--------|-----------|---------------------|
| `products_backup` | 735 | Backup antigo, não é mais necessário |
| `storage_stats_backup` | 1 | Backup de migration antiga |

---

### GRUPO 3 - Tabelas de TRACKING com POUCOS/NENHUM dado

| Tabela | Registros | Recomendação |
|--------|-----------|--------------|
| `mouse_tracking` | 4 | Remover - tracking granular não usado |
| `scroll_behavior` | 0 | Remover - vazio e não utilizado |
| `navigation_flow` | 3 | Remover - dados mínimos |
| `customer_ltv` | 0 | Remover - vazio |
| `realtime_activity` | 0 | Remover - vazio |
| `product_affinity` | 0 | Remover - vazio |
| `performance_vitals` | 4 | Remover - dados mínimos |

---

### GRUPO 4 - Tabelas de TRACKING para MANTER (Dados úteis)

| Tabela | Registros | Motivo para Manter |
|--------|-----------|-------------------|
| `page_interactions` | 86.210 | Dados valiosos de comportamento |
| `user_journey_detailed` | 1.527 | Jornada do usuário útil |
| `customer_events` | 36.725 | Eventos de analytics importantes |
| `period_analytics` | 12 | Métricas agregadas |
| `cart_abandonment` | 3 | Dados de abandono de carrinho |

---

### GRUPO 5 - Tabelas UTI COINS para MANTER

| Tabela | Status |
|--------|--------|
| `uti_coins` | Manter - saldo dos usuários |
| `coin_transactions` | Manter - histórico de ganhos/gastos |
| `coin_rules` | Manter - regras de ganho de coins |
| `coin_system_config` | Manter - configurações do sistema |
| `user_streaks` | Manter - sequência de dias |
| `daily_bonus_codes` | Manter - sistema de códigos diários ativo |
| `user_bonus_claims` | Manter - resgates de bônus diário |
| `daily_actions` | Manter - limites diários |

---

## Implementação

### Passo 1: SQL para Remover Tabelas Obsoletas

```sql
-- REMOVER TABELAS DO SISTEMA DE LOJA DE COINS (GRUPO 1)
DROP TABLE IF EXISTS redemption_codes CASCADE;
DROP TABLE IF EXISTS coin_redemptions CASCADE;
DROP TABLE IF EXISTS coin_products CASCADE;

-- REMOVER BACKUPS (GRUPO 2)
DROP TABLE IF EXISTS products_backup CASCADE;
DROP TABLE IF EXISTS storage_stats_backup CASCADE;

-- REMOVER TRACKING NÃO UTILIZADO (GRUPO 3)
DROP TABLE IF EXISTS mouse_tracking CASCADE;
DROP TABLE IF EXISTS scroll_behavior CASCADE;
DROP TABLE IF EXISTS navigation_flow CASCADE;
DROP TABLE IF EXISTS customer_ltv CASCADE;
DROP TABLE IF EXISTS realtime_activity CASCADE;
DROP TABLE IF EXISTS product_affinity CASCADE;
DROP TABLE IF EXISTS performance_vitals CASCADE;
```

### Passo 2: Remover Código Frontend Relacionado

**Arquivos a deletar:**
- `src/pages/CoinsShop.tsx`
- `src/pages/RedemptionHistory.tsx`
- `src/components/Retention/RedemptionModal.tsx`
- `src/components/Retention/RedemptionHistoryModal.tsx`

**Arquivos a modificar:**
- `src/App.tsx` - Remover rotas `/coins` e `/redemption-history`
- `src/integrations/supabase/types.ts` - Regenerar após remover tabelas

### Passo 3: Funções RPC a Remover

```sql
-- Funções do sistema de loja obsoleto
DROP FUNCTION IF EXISTS redeem_product_v2 CASCADE;
DROP FUNCTION IF EXISTS generate_redemption_code CASCADE;
DROP FUNCTION IF EXISTS admin_redeem_code CASCADE;
DROP FUNCTION IF EXISTS get_admin_redemptions CASCADE;
```

---

## Resumo do Impacto

| Categoria | Antes | Depois |
|-----------|-------|--------|
| Tabelas Removidas | 0 | 14 |
| Registros Removidos | ~750 | - |
| Arquivos Frontend Deletados | 0 | 4+ |
| Sistema de Loja | Ativo | Removido |
| Desconto UTI Coins | Ativo | Mantido (via produtos) |

---

## Seção Técnica

### Ordem de Execução (Importante!)

1. **Primeiro**: Remover tabelas dependentes (`redemption_codes`, `coin_redemptions`)
2. **Segundo**: Remover tabela principal (`coin_products`)
3. **Terceiro**: Remover demais tabelas
4. **Quarto**: Atualizar código frontend
5. **Quinto**: Regenerar tipos TypeScript

### Verificação Pós-Limpeza

```sql
-- Verificar tabelas restantes
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

