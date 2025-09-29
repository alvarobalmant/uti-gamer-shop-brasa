-- Add detailed logging to daily_codes function to catch the exact error
-- This will help us debug what's happening

CREATE OR REPLACE FUNCTION debug_daily_codes_issue(p_user_id UUID, p_code TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
  existing_code RECORD;
  current_code RECORD;
  user_codes_count INTEGER;
BEGIN
  -- Check if code exists
  SELECT * INTO current_code FROM daily_codes WHERE code = p_code;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'code_not_found', 'code', p_code);
  END IF;
  
  -- Check if user already has this code
  SELECT * INTO existing_code FROM user_daily_codes WHERE user_id = p_user_id AND code = p_code;
  
  IF FOUND THEN
    RETURN json_build_object('error', 'code_already_claimed', 'existing_record', row_to_json(existing_code));
  END IF;
  
  -- Count user codes today
  SELECT COUNT(*) INTO user_codes_count 
  FROM user_daily_codes 
  WHERE user_id = p_user_id 
  AND DATE(added_at) = CURRENT_DATE;
  
  -- Return debug info
  result = json_build_object(
    'code_info', row_to_json(current_code),
    'user_codes_today', user_codes_count,
    'can_claim', CASE 
      WHEN user_codes_count > 0 THEN false
      ELSE true
    END,
    'current_time', NOW(),
    'claimable_until', current_code.claimable_until,
    'is_within_claim_window', NOW() <= current_code.claimable_until
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;