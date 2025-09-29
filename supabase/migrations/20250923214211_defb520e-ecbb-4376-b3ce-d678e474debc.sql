-- Corrigir função de período para sincronizar com criação de códigos às 20h Brasília
CREATE OR REPLACE FUNCTION public.get_current_bonus_period_brasilia()
 RETURNS TABLE(period_start timestamp with time zone, period_end timestamp with time zone, next_reset timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  now_utc TIMESTAMP WITH TIME ZONE;
  brasilia_now TIMESTAMP;
  today_8pm_brasilia TIMESTAMP;
  yesterday_8pm_brasilia TIMESTAMP;
  tomorrow_8pm_brasilia TIMESTAMP;
  today_8pm_utc TIMESTAMP WITH TIME ZONE;
  yesterday_8pm_utc TIMESTAMP WITH TIME ZONE;
  tomorrow_8pm_utc TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get current UTC time
  now_utc := NOW();
  
  -- Convert to Brasília time for calculations
  brasilia_now := now_utc AT TIME ZONE 'America/Sao_Paulo';
  
  -- Calculate 8 PM points in Brasília
  today_8pm_brasilia := DATE(brasilia_now) + TIME '20:00:00';
  yesterday_8pm_brasilia := today_8pm_brasilia - INTERVAL '1 day';
  tomorrow_8pm_brasilia := today_8pm_brasilia + INTERVAL '1 day';
  
  -- Convert back to UTC for storage
  today_8pm_utc := today_8pm_brasilia AT TIME ZONE 'America/Sao_Paulo';
  yesterday_8pm_utc := yesterday_8pm_brasilia AT TIME ZONE 'America/Sao_Paulo';
  tomorrow_8pm_utc := tomorrow_8pm_brasilia AT TIME ZONE 'America/Sao_Paulo';
  
  -- CORREÇÃO CRÍTICA: Determinar período ativo baseado EXATAMENTE em 20h
  -- Se agora >= 20h hoje: período atual é hoje 20h até amanhã 20h
  -- Se agora < 20h hoje: período atual é ontem 20h até hoje 20h
  IF brasilia_now >= today_8pm_brasilia THEN
    -- Agora é >= 20h hoje: período ativo de hoje 20h até amanhã 20h
    RETURN QUERY SELECT 
      today_8pm_utc as period_start,
      tomorrow_8pm_utc as period_end,
      tomorrow_8pm_utc as next_reset;
  ELSE
    -- Agora é < 20h hoje: período ativo de ontem 20h até hoje 20h
    RETURN QUERY SELECT 
      yesterday_8pm_utc as period_start,
      today_8pm_utc as period_end,
      today_8pm_utc as next_reset;
  END IF;
END;
$function$;