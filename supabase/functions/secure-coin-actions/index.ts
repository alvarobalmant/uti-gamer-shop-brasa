import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.71.1'

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

    // Check UTI Coins system status usando nova arquitetura consolidada
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

    // Verificar atividade suspeita usando nova função do backend
    const { data: isSuspicious, error: suspiciousError } = await supabase
      .rpc('check_suspicious_activity', { 
        p_user_id: user.id, 
        p_action: action 
      });

    if (suspiciousError) {
      console.warn('Erro ao verificar atividade suspeita:', suspiciousError);
    } else if (isSuspicious) {
      console.log(`[SECURITY] Suspicious activity detected for user ${user.id}, action: ${action}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          suspicious: true,
          message: 'Atividade suspeita detectada. Conta temporariamente restrita.' 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Handle different actions usando arquitetura consolidada
    let result;
    
    if (action === 'daily_login') {
      console.log(`[BACKEND_CLOCK] Validating action "${action}" at ${new Date().toISOString()}`);
      
      // Check if user already logged in today
      const today = new Date().toISOString().split('T')[0];
      const { data: existingLogin } = await supabase
        .from('daily_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('action', 'daily_login')
        .eq('action_date', today)
        .single();

      if (existingLogin) {
        const lastLogin = new Date(existingLogin.last_performed_at);
        console.log(`[BACKEND_CLOCK] Daily login already done today. Last: ${lastLogin.toISOString()}, Current: ${new Date().toISOString()}`);
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            rateLimited: true,
            message: 'Login diário já realizado hoje',
            lastLogin: lastLogin.toISOString()
          }),
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log(`[BACKEND_CLOCK] Daily limit check: 0/1 for action "${action}"`);
      console.log(`[BACKEND_CLOCK] Action "${action}" validated successfully at ${new Date().toISOString()}`);

      // Process daily login through database function
      const { data: loginResult, error: loginError } = await supabase
        .rpc('process_daily_login', { p_user_id: user.id });

      if (loginError) {
        console.error('Error processing daily login:', loginError);
        return new Response(
          JSON.stringify({ success: false, message: 'Failed to process daily login' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      result = loginResult;
      console.log(`[SUCCESS] User ${user.id} earned coins for action: ${action}`);
      
    } else {
      // Handle other coin earning actions usando nova arquitetura
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