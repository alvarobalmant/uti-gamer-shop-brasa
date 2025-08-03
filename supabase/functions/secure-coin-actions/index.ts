import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ success: false, message: 'No authorization provided' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ success: false, message: 'Authentication required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const { action, metadata = {} } = await req.json();
    
    console.log(`[SECURITY] User ${user.id} requesting action: ${action}`);
    
    if (!action) {
      return new Response(
        JSON.stringify({ success: false, message: 'Action is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check UTI Coins system status
    const { data: settings } = await supabase
      .from('coin_system_config')
      .select('setting_value')
      .eq('setting_key', 'system_enabled')
      .single();

    const isSystemEnabled = settings?.setting_value === 'true' || settings?.setting_value === true;
    
    if (!isSystemEnabled) {
      return new Response(
        JSON.stringify({ success: false, message: 'UTI Coins system is currently disabled' }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Handle different actions
    let result;
    
    if (action === 'daily_login') {
      console.log(`[BRASILIA_TIMER] Processing daily login for user ${user.id} at ${new Date().toISOString()}`);
      
      // Use new Brasilia-based function
      const { data: loginResult, error: loginError } = await supabase
        .rpc('process_daily_login_brasilia', { p_user_id: user.id });

      if (loginError) {
        console.error('Error processing daily login (Brasilia):', loginError);
        return new Response(
          JSON.stringify({ success: false, message: 'Failed to process daily login' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      result = loginResult;
      
      if (result.success) {
        console.log(`[SUCCESS] User ${user.id} earned coins for daily login (Brasilia timer)`);
      } else {
        console.log(`[RATE_LIMITED] User ${user.id} daily login blocked: ${result.message}`);
      }
      
    } else if (action === 'get_daily_timer') {
      console.log(`[BRASILIA_TIMER] Getting timer status for user ${user.id}`);
      
      // Get current daily bonus status using the Brasilia timezone function
      const { data: timerResult, error: timerError } = await supabase
        .rpc('can_claim_daily_bonus_brasilia', { p_user_id: user.id });

      if (timerError) {
        console.error('Error getting daily timer (Brasilia):', timerError);
        return new Response(
          JSON.stringify({ success: false, message: 'Failed to get timer status' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Return timer data with proper structure
      if (timerResult && timerResult.length > 0) {
        const timerData = timerResult[0];
        result = {
          success: true,
          canClaim: timerData.can_claim,
          nextReset: timerData.next_reset,
          periodStart: timerData.period_start,
          periodEnd: timerData.period_end,
          lastClaim: timerData.last_claim
        };
      } else {
        result = {
          success: false,
          message: 'Failed to get daily bonus status'
        };
      }
      
    } else if (action === 'can_claim_daily_bonus_brasilia') {
      console.log(`[BRASILIA_TIMER] Checking if user ${user.id} can claim daily bonus`);
      
      // Use the same function as get_daily_timer but with different action name for compatibility
      const { data: bonusResult, error: bonusError } = await supabase
        .rpc('can_claim_daily_bonus_brasilia', { p_user_id: user.id });

      if (bonusError) {
        console.error('Error checking daily bonus (Brasilia):', bonusError);
        return new Response(
          JSON.stringify({ success: false, message: 'Failed to check bonus status' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if (bonusResult && bonusResult.length > 0) {
        const bonusData = bonusResult[0];
        result = {
          success: true,
          canClaim: bonusData.can_claim,
          streak: bonusData.streak || 0,
          multiplier: bonusData.multiplier || 1.0,
          nextReset: bonusData.next_reset,
          lastClaim: bonusData.last_claim
        };
      } else {
        result = {
          success: false,
          message: 'Failed to get bonus data'
        };
      }
      
    } else if (action === 'process_daily_login_brasilia') {
      console.log(`[BRASILIA_TIMER] Processing daily login for user ${user.id}`);
      
      // Use the Brasilia login processing function
      const { data: loginResult, error: loginError } = await supabase
        .rpc('process_daily_login_brasilia', { p_user_id: user.id });

      if (loginError) {
        console.error('Error processing daily login (Brasilia):', loginError);
        return new Response(
          JSON.stringify({ success: false, message: 'Failed to process daily login' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      result = loginResult;
      
      if (result && result.success) {
        console.log(`[SUCCESS] User ${user.id} earned coins for daily login (Brasilia timer)`);
      } else {
        console.log(`[RATE_LIMITED] User ${user.id} daily login blocked: ${result?.message || 'Unknown error'}`);
      }
      
    } else {
      // Handle other coin earning actions
      console.log(`[BACKEND_CLOCK] Validating action "${action}" at ${new Date().toISOString()}`);
      
      const { data: earnResult, error: earnError } = await supabase
        .rpc('earn_coins', {
          p_user_id: user.id,
          p_action: action,
          p_amount: metadata.amount,
          p_description: metadata.description,
          p_metadata: metadata
        });

      if (earnError) {
        console.error('Error earning coins:', earnError);
        return new Response(
          JSON.stringify({ success: false, message: 'Failed to earn coins' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      result = earnResult;
      console.log(`[SUCCESS] User ${user.id} earned coins for action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});