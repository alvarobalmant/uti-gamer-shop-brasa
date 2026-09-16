DO $$
DECLARE r record;
  internal_names text[] := ARRAY[
    'trigger_set_timestamp','update_updated_at','update_updated_at_column','set_updated_at',
    'update_integra_updated_at','protect_user_profile_role','create_user_profile','create_user_uti_coins',
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
  ];
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig, p.proname
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prokind = 'f' AND p.prosecdef
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', r.sig);

    IF NOT (
      r.proname = ANY(internal_names)
      OR r.proname LIKE 'cleanup_%' OR r.proname LIKE 'debug_%' OR r.proname LIKE 'test_%'
    ) THEN
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', r.sig);
    END IF;
  END LOOP;
END $$;

-- Public order status lookup stays available to visitors
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname IN ('get_order_public_status','has_admin_users')
  LOOP
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO anon', r.sig);
  END LOOP;
END $$;
