-- 1) Fix mutable search_path on all public functions
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prokind = 'f'
      AND (p.proconfig IS NULL OR NOT EXISTS (
        SELECT 1 FROM unnest(p.proconfig) c WHERE c LIKE 'search_path=%'))
  LOOP
    EXECUTE format('ALTER FUNCTION %s SET search_path = public', r.sig);
  END LOOP;
END $$;

-- 2) Security definer view -> invoker
ALTER VIEW public.view_homepage_layout_complete SET (security_invoker = true);

-- 3) Materialized view must not be exposed through the Data API
REVOKE ALL ON public.mv_category_performance FROM anon, authenticated;
GRANT SELECT ON public.mv_category_performance TO service_role;

-- 4) Internal-only functions: not callable from the API at all
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig, p.proname
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prokind = 'f'
      AND (
        p.proname LIKE 'cleanup_%' OR p.proname LIKE 'debug_%' OR p.proname LIKE 'test_%'
        OR p.proname LIKE 'update_updated_at%' OR p.proname LIKE 'set_updated_at%'
        OR p.proname IN (
          'trigger_set_timestamp','update_updated_at','update_integra_updated_at',
          'protect_user_profile_role','create_user_profile','create_user_uti_coins',
          'auto_update_uti_pro_enabled','update_user_balance',
          'apply_order_stock','release_order_stock','reserve_order_stock',
          'process_analytics_batch','process_realtime_analytics','correlate_performance_behavior',
          'detect_anomalies','detect_friction_patterns','update_churn_risk','update_engagement_scores',
          'refresh_materialized_views','monitor_query_performance','analyze_index_usage',
          'categorize_existing_tags','calculate_engagement_score',
          'generate_admin_token','validate_admin_token','create_admin_link','create_admin_link_secure',
          'promote_user_to_admin','log_admin_action','log_security_event',
          'generate_daily_code','generate_unique_daily_code','generate_unique_4digit_code','generate_order_code',
          'cleanup_old_data'
        )
      )
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM anon, authenticated', r.sig);
  END LOOP;
END $$;

-- 5) Admin/analytics functions: signed-in admins only (never anonymous)
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prokind = 'f'
      AND (
        p.proname LIKE 'get_%analytics%' OR p.proname LIKE 'get_realtime%'
        OR p.proname IN (
          'get_abandonment_analysis_by_sector','get_behavioral_segmentation','get_churn_prediction',
          'get_conversion_routes_analysis','get_friction_points_analysis','get_heatmap_enterprise_data',
          'get_performance_correlation','get_predictive_conversion_score','get_real_time_alerts',
          'get_top_products_analytics','get_user_complete_journey','get_dashboard_analytics',
          'delete_master_product_cascade','redeem_code_admin','complete_order_verification',
          'verify_order_code','verify_redemption_code','adicionar_meses_assinatura',
          'remover_meses_assinatura','cancelar_assinatura','check_email_confirmation_status',
          'redeem_pro_code','redeem_coin_product','spend_coins_for_discount','earn_coins',
          'process_daily_login','process_daily_login_brasilia','process_daily_login_test',
          'can_claim_daily_bonus_brasilia','can_claim_daily_bonus_test','can_claim_code',
          'is_code_valid','is_user_flagged','check_suspicious_activity','create_order_verification_code'
        )
      )
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM anon', r.sig);
  END LOOP;
END $$;
