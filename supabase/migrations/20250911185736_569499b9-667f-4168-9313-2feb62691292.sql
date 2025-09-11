-- Fix timezone issues in daily codes system
-- First drop the existing function to allow changing return type

DROP FUNCTION IF EXISTS public.get_current_bonus_period_brasilia();

-- 1. Fix the generate_daily_code function to use UTC consistently and calculate Brasília times correctly
CREATE OR REPLACE FUNCTION generate_daily_code()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_code VARCHAR(4);
  claimable_until TIMESTAMP WITH TIME ZONE;
  valid_until TIMESTAMP WITH TIME ZONE;
  now_utc TIMESTAMP WITH TIME ZONE;
  next_brasilia_8pm TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get current UTC time
  now_utc := NOW();
  
  -- Calculate the next 8 PM in Brasília time
  -- First, get current time in Brasília
  DECLARE
    brasilia_now TIMESTAMP;
    brasilia_today_8pm TIMESTAMP;
    brasilia_tomorrow_8pm TIMESTAMP;
  BEGIN
    -- Convert current UTC to Brasília time (but as timestamp without timezone)
    brasilia_now := now_utc AT TIME ZONE 'America/Sao_Paulo';
    
    -- Calculate 8 PM today in Brasília
    brasilia_today_8pm := DATE(brasilia_now) + TIME '20:00:00';
    
    -- Calculate 8 PM tomorrow in Brasília
    brasilia_tomorrow_8pm := brasilia_today_8pm + INTERVAL '1 day';
    
    -- If it's before 8 PM Brasília today, next reset is today at 8 PM
    -- If it's after 8 PM Brasília today, next reset is tomorrow at 8 PM
    IF brasilia_now < brasilia_today_8pm THEN
      next_brasilia_8pm := brasilia_today_8pm AT TIME ZONE 'America/Sao_Paulo';
    ELSE
      next_brasilia_8pm := brasilia_tomorrow_8pm AT TIME ZONE 'America/Sao_Paulo';
    END IF;
  END;
  
  -- Set claimable window: from now until next 8 PM Brasília (up to 24 hours)
  claimable_until := next_brasilia_8pm;
  
  -- Set validity window: 24 hours after claimable expires (total 48 hours max)
  valid_until := claimable_until + INTERVAL '24 hours';
  
  -- Generate unique code
  new_code := generate_unique_4digit_code();
  
  -- Insert code with correct UTC timestamps
  INSERT INTO daily_codes (code, created_at, claimable_until, valid_until)
  VALUES (new_code, now_utc, claimable_until, valid_until);
  
  RETURN jsonb_build_object(
    'success', true,
    'code', new_code,
    'created_at', now_utc,
    'claimable_until', claimable_until,
    'valid_until', valid_until,
    'next_brasilia_8pm', next_brasilia_8pm,
    'message', 'Código diário gerado com sucesso'
  );
END;
$$;

-- 2. Recreate the get_current_bonus_period_brasilia function with consistent UTC handling
CREATE OR REPLACE FUNCTION public.get_current_bonus_period_brasilia()
RETURNS TABLE(
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  next_reset TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
  
  -- Determine current period based on Brasília time
  IF brasilia_now < today_8pm_brasilia THEN
    -- Before 8 PM today: period is yesterday 8 PM to today 8 PM
    RETURN QUERY SELECT 
      yesterday_8pm_utc as period_start,
      today_8pm_utc as period_end,
      today_8pm_utc as next_reset;
  ELSE
    -- After 8 PM today: period is today 8 PM to tomorrow 8 PM
    RETURN QUERY SELECT 
      today_8pm_utc as period_start,
      tomorrow_8pm_utc as period_end,
      tomorrow_8pm_utc as next_reset;
  END IF;
END;
$$;

-- 3. Add function to get next 8 PM Brasília time for frontend use
CREATE OR REPLACE FUNCTION public.get_next_brasilia_8pm()
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  now_utc TIMESTAMP WITH TIME ZONE;
  brasilia_now TIMESTAMP;
  today_8pm_brasilia TIMESTAMP;
  tomorrow_8pm_brasilia TIMESTAMP;
  next_8pm_utc TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get current UTC time
  now_utc := NOW();
  
  -- Convert to Brasília time
  brasilia_now := now_utc AT TIME ZONE 'America/Sao_Paulo';
  
  -- Calculate 8 PM today and tomorrow in Brasília
  today_8pm_brasilia := DATE(brasilia_now) + TIME '20:00:00';
  tomorrow_8pm_brasilia := today_8pm_brasilia + INTERVAL '1 day';
  
  -- Determine next 8 PM
  IF brasilia_now < today_8pm_brasilia THEN
    next_8pm_utc := today_8pm_brasilia AT TIME ZONE 'America/Sao_Paulo';
  ELSE
    next_8pm_utc := tomorrow_8pm_brasilia AT TIME ZONE 'America/Sao_Paulo';
  END IF;
  
  RETURN next_8pm_utc;
END;
$$;