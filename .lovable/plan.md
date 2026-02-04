## Limpeza do Banco de Dados - UTI Games

### ✅ CONCLUÍDO em 2026-02-04

---

## Resumo da Limpeza Realizada

### Tabelas Removidas (14 total)

| Grupo | Tabela | Status |
|-------|--------|--------|
| Sistema Loja Coins | `coin_products` | ✅ Removida |
| Sistema Loja Coins | `coin_redemptions` | ✅ Removida |
| Sistema Loja Coins | `redemption_codes` | ✅ Removida |
| Backups | `products_backup` | ✅ Removida |
| Backups | `storage_stats_backup` | ✅ Removida |
| Tracking | `mouse_tracking` | ✅ Removida |
| Tracking | `scroll_behavior` | ✅ Removida |
| Tracking | `navigation_flow` | ✅ Removida |
| Tracking | `customer_ltv` | ✅ Removida |
| Tracking | `realtime_activity` | ✅ Removida |
| Tracking | `product_affinity` | ✅ Removida |
| Tracking | `performance_vitals` | ✅ Removida |

### Funções RPC Removidas

- `redeem_product_v2`
- `generate_redemption_code`
- `admin_redeem_code`
- `get_admin_redemptions`

### Arquivos Frontend Removidos

- `src/pages/CoinsShop.tsx`
- `src/pages/RedemptionHistory.tsx`
- `src/components/Retention/RedemptionModal.tsx`
- `src/components/Retention/RedemptionHistoryModal.tsx`

### Arquivos Atualizados

- `src/App.tsx` - Removido import do CoinsShop
- `src/components/Admin/UTICoinsManager.tsx` - Removida aba de produtos
- `src/components/Admin/Analytics/ClientAnalysisTableSimplified.tsx` - Removida referência a `realtime_activity`
- `src/components/Admin/Analytics/ClientJourneyTimelineDebug.tsx` - Removida referência a `realtime_activity`
- `src/components/Admin/Analytics/ClientJourneyTimelineFixed.tsx` - Removida referência a `realtime_activity`
- `src/hooks/useAnalyticsData.ts` - Removida referência a `customer_ltv`
- `src/hooks/useEnterpriseTracking.ts` - Removida referência a `realtime_activity`

---

## Sistema UTI Coins Mantido

O sistema de UTI Coins continua funcionando normalmente, agora focado em:

1. **Desconto direto nos produtos** via `uti_coins_discount_percentage`
2. **Cashback** via `uti_coins_cashback_percentage`
3. **Daily Bonus** para ganho de coins
4. **Regras de ganho** configuráveis via admin

### Tabelas Ativas do Sistema UTI Coins

| Tabela | Função |
|--------|--------|
| `uti_coins` | Saldo dos usuários |
| `coin_transactions` | Histórico de ganhos/gastos |
| `coin_rules` | Regras de ganho de coins |
| `coin_system_config` | Configurações globais |
| `user_streaks` | Sequência de dias |
| `daily_bonus_codes` | Códigos diários |
| `user_bonus_claims` | Resgates de bônus |
| `daily_actions` | Limites diários |
