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
      console.log(`[DAILY_BONUS] Checking bonus status for user ${user.id}`);
      
      try {
        // Check if test mode is enabled
        const { data: testModeData } = await supabase
          .from('coin_system_config')
          .select('setting_value')
          .eq('setting_key', 'test_mode_enabled')
          .single();

        const isTestMode = testModeData?.setting_value === 'true' || testModeData?.setting_value === true;
        const rpcFunction = isTestMode ? 'can_claim_daily_bonus_test' : 'can_claim_daily_bonus_brasilia';
        
        console.log(`[DAILY_BONUS] Using ${isTestMode ? 'TEST' : 'PRODUCTION'} mode for user ${user.id}`);

        // Get current bonus period and claim status
        const { data: bonusResult, error: bonusError } = await supabase
          .rpc(rpcFunction, { p_user_id: user.id });

        if (bonusError) {
          console.error('[DAILY_BONUS] Error checking bonus status:', bonusError);
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
          
          // Get user streak information with last login date for validation
          const { data: streakData } = await supabase
            .from('user_streaks')
            .select('current_streak, streak_multiplier, last_login_date')
            .eq('user_id', user.id)
            .single();

          // Validate streak status - reset if user missed days (or time in test mode)
          let validatedStreak = streakData?.current_streak || 0;
          
          if (streakData?.last_login_date) {
            const now = new Date();
            const lastLoginDate = new Date(streakData.last_login_date);
            
            let streakLost = false;
            
            if (isTestMode) {
              // No modo de teste, verificar se passou mais de 2x o cooldown (tolerância para teste)
              const { data: testCooldownData } = await supabase
                .from('coin_system_config')
                .select('setting_value')
                .eq('setting_key', 'test_cooldown_seconds')
                .single();
              
              const testCooldownSeconds = parseInt(testCooldownData?.setting_value || '10');
              const maxTestGapSeconds = testCooldownSeconds * 2; // 2x o cooldown para tolerância
              const secondsSinceLastLogin = Math.floor((now.getTime() - lastLoginDate.getTime()) / 1000);
              
              if (secondsSinceLastLogin > maxTestGapSeconds) {
                streakLost = true;
                console.log(`[STREAK_VALIDATION] TEST MODE: User ${user.id} missed streak. ${secondsSinceLastLogin}s > ${maxTestGapSeconds}s threshold. Resetting streak from ${validatedStreak} to 0`);
              }
            } else {
              // Modo normal: verificar se passou mais de 1 dia
              const daysSinceLastLogin = Math.floor((now.getTime() - lastLoginDate.getTime()) / (24 * 60 * 60 * 1000));
              
              if (daysSinceLastLogin > 1) {
                streakLost = true;
                console.log(`[STREAK_VALIDATION] User ${user.id} missed ${daysSinceLastLogin} days. Resetting streak from ${validatedStreak} to 0`);
              }
            }
            
            if (streakLost) {
              // Update user_streaks table to reset streak
              const { error: updateError } = await supabase
                .from('user_streaks')
                .update({ 
                  current_streak: 0,
                  updated_at: now.toISOString()
                })
                .eq('user_id', user.id);
              
              if (updateError) {
                console.error('[STREAK_VALIDATION] Error updating streak:', updateError);
              } else {
                console.log(`[STREAK_VALIDATION] Successfully reset streak for user ${user.id}`);
                validatedStreak = 0;
              }
            } else {
              const timeInfo = isTestMode ? 
                `${Math.floor((now.getTime() - lastLoginDate.getTime()) / 1000)} seconds` : 
                `${Math.floor((now.getTime() - lastLoginDate.getTime()) / (24 * 60 * 60 * 1000))} days`;
              console.log(`[STREAK_VALIDATION] User ${user.id} streak is valid. Time since last login: ${timeInfo}`);
            }
          } else {
            console.log(`[STREAK_VALIDATION] User ${user.id} has no last_login_date. Setting streak to 0`);
            validatedStreak = 0;
          }

          // Get daily bonus configuration - buscar novas configurações
          const { data: configData } = await supabase
            .from('coin_system_config')
            .select('setting_key, setting_value')
            .in('setting_key', [
              'daily_bonus_base_amount', 
              'daily_bonus_max_amount', 
              'daily_bonus_streak_days',
              'daily_bonus_increment_type',
              'daily_bonus_fixed_increment'
            ]);

          let baseAmount = 10;
          let maxAmount = 100;
          let streakDays = 7;
          let incrementType = 'calculated';
          let fixedIncrement = 10;

          if (configData) {
            configData.forEach(config => {
              // Extrair valor do JSONB - tratamento mais robusto
              let value = config.setting_value;
              
              // Se for um objeto JSONB, extrair o valor
              if (typeof value === 'object' && value !== null) {
                value = value;
              } else if (typeof value === 'string') {
                // Se for string com aspas, remover
                if (value.startsWith('"') && value.endsWith('"')) {
                  value = value.slice(1, -1);
                }
                // Tentar converter para número se for numérico
                if (!isNaN(Number(value))) {
                  value = Number(value);
                }
              }
                
              switch (config.setting_key) {
                case 'daily_bonus_base_amount':
                  baseAmount = Number(value) || 10;
                  break;
                case 'daily_bonus_max_amount':
                  maxAmount = Number(value) || 100;
                  break;
                case 'daily_bonus_streak_days':
                  streakDays = Number(value) || 7;
                  break;
                case 'daily_bonus_increment_type':
                  incrementType = String(value) || 'calculated';
                  break;
                case 'daily_bonus_fixed_increment':
                  fixedIncrement = Number(value) || 10;
                  break;
              }
            });
          }

          // Calcular próximo bônus baseado no streak validado e configuração
          const currentStreak = validatedStreak; // Usar streak validado (pode ser 0)
          const currentStreakDay = validatedStreak;
          let nextBonusAmount;
          
          if (incrementType === 'fixed') {
            nextBonusAmount = Math.min(baseAmount + ((currentStreakDay - 1) * fixedIncrement), maxAmount);
          } else {
            if (streakDays > 1) {
              nextBonusAmount = baseAmount + Math.round(((maxAmount - baseAmount) * (currentStreakDay - 1)) / (streakDays - 1));
            } else {
              nextBonusAmount = baseAmount;
            }
          }
          
          nextBonusAmount = Math.min(nextBonusAmount, maxAmount);

          // Calculate seconds until next claim
          let secondsUntilNextClaim = 0;
          if (bonusData.next_reset && !bonusData.can_claim) {
            const nextReset = new Date(bonusData.next_reset);
            const now = new Date();
            secondsUntilNextClaim = Math.max(0, Math.floor((nextReset.getTime() - now.getTime()) / 1000));
          }

          console.log(`[DAILY_BONUS] User ${user.id} bonus status:`, {
            canClaim: bonusData.can_claim,
            originalStreak: streakData?.current_streak || 0,
            validatedStreak: validatedStreak,
            currentStreak,
            nextBonusAmount,
            secondsUntilNextClaim,
            nextReset: bonusData.next_reset,
            lastClaim: bonusData.last_claim,
            testMode: isTestMode
          });

          result = {
            success: true,
            canClaim: bonusData.can_claim || false,
            secondsUntilNextClaim: secondsUntilNextClaim || 0,
            currentStreak: validatedStreak, // Mostrar o streak real validado
            validatedStreak: validatedStreak,
            nextBonusAmount: nextBonusAmount,
            multiplier: 1.0,
            nextReset: bonusData.next_reset,
            lastClaim: bonusData.last_claim,
            testMode: isTestMode,
            totalStreakDays: streakDays,
            message: bonusData.can_claim ? 'Bonus available' : (isTestMode ? 'Aguarde ' + Math.ceil(secondsUntilNextClaim) + ' segundos' : 'Bonus already claimed today')
          };
        } else {
          result = {
            success: false,
            message: 'No bonus data available - database function may have failed'
          };
        }
      } catch (error) {
        console.error('[DAILY_BONUS] Exception checking bonus status:', error);
        return new Response(
          JSON.stringify({ success: false, message: 'Internal server error checking bonus' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
    } else if (action === 'process_daily_login_brasilia') {
      console.log(`[DAILY_LOGIN] Processing daily login for user ${user.id}`);
      
      try {
        // Check if test mode is enabled
        const { data: testModeData } = await supabase
          .from('coin_system_config')
          .select('setting_value')
          .eq('setting_key', 'test_mode_enabled')
          .single();

        const isTestMode = testModeData?.setting_value === 'true' || testModeData?.setting_value === true;
        const rpcFunction = isTestMode ? 'process_daily_login_test' : 'process_daily_login_brasilia';
        
        console.log(`[DAILY_LOGIN] Using ${isTestMode ? 'TEST' : 'PRODUCTION'} mode for user ${user.id}`);

        // Use the appropriate login processing function
        const { data: loginResult, error: loginError } = await supabase
          .rpc(rpcFunction, { p_user_id: user.id });

        if (loginError) {
          console.error('[DAILY_LOGIN] Error processing daily login:', loginError);
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
          console.log(`[DAILY_LOGIN] SUCCESS: User ${user.id} earned ${result.coins_earned} coins. New streak: ${result.streak} (${isTestMode ? 'TEST' : 'PRODUCTION'} mode)`);
        } else {
          console.log(`[DAILY_LOGIN] BLOCKED: User ${user.id} login blocked: ${result?.message || 'Unknown error'} (${isTestMode ? 'TEST' : 'PRODUCTION'} mode)`);
        }
      } catch (error) {
        console.error('[DAILY_LOGIN] Exception processing daily login:', error);
        return new Response(
          JSON.stringify({ success: false, message: 'Internal server error processing login' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
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