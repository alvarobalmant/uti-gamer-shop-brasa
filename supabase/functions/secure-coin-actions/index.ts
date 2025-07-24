import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SecurityLog {
  user_id: string;
  action: string;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  metadata: any;
  suspicious: boolean;
}

interface ActionValidation {
  isValid: boolean;
  reason?: string;
  rateLimited?: boolean;
  suspicious?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!
    const jwt = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt)
    if (authError || !user) {
      console.error('Authentication failed:', authError)
      return new Response(
        JSON.stringify({ success: false, message: 'Não autorizado' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { action, metadata = {} } = await req.json()
    
    // Get client info for security
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    const timestamp = new Date().toISOString()

    console.log(`[SECURITY] User ${user.id} requesting action: ${action}`)

    // Validate action with comprehensive security checks
    const validation = await validateSecureAction(supabase, user.id, action, {
      ip_address: clientIP,
      user_agent: userAgent,
      timestamp,
      metadata
    })

    // Log all attempts for security monitoring
    await logSecurityEvent(supabase, {
      user_id: user.id,
      action,
      ip_address: clientIP,
      user_agent: userAgent,
      timestamp,
      metadata,
      suspicious: validation.suspicious || false
    })

    if (!validation.isValid) {
      console.warn(`[SECURITY] Action rejected for user ${user.id}: ${validation.reason}`)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: validation.reason,
          rateLimited: validation.rateLimited,
          suspicious: validation.suspicious
        }),
        { 
          status: validation.rateLimited ? 429 : 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Execute the secure coin earning using the database function
    const { data: result, error: coinError } = await supabase.rpc('earn_coins', {
      p_user_id: user.id,
      p_action: action,
      p_description: `Ação validada pelo backend: ${action}`,
      p_metadata: {
        ...metadata,
        validated_at: timestamp,
        ip_address: clientIP,
        security_check: 'passed'
      }
    })

    if (coinError) {
      console.error('Database error:', coinError)
      return new Response(
        JSON.stringify({ success: false, message: 'Erro interno do servidor' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`[SUCCESS] User ${user.id} earned coins for action: ${action}`)

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function validateSecureAction(
  supabase: any, 
  userId: string, 
  action: string, 
  context: any
): Promise<ActionValidation> {
  try {
    const currentTime = new Date()
    const currentTimestamp = currentTime.toISOString()
    
    console.log(`[BACKEND_CLOCK] Validating action "${action}" at ${currentTimestamp}`)

    // 1. Check if action exists and is active
    const { data: rule, error: ruleError } = await supabase
      .from('coin_rules')
      .select('*')
      .eq('action', action)
      .eq('is_active', true)
      .single()

    if (ruleError || !rule) {
      console.log(`[BACKEND_CLOCK] Action "${action}" not found or inactive`)
      return { isValid: false, reason: 'Ação não autorizada' }
    }

    // 2. Get the most recent transaction for this action to check exact cooldown
    const { data: lastTransaction, error: lastError } = await supabase
      .from('coin_transactions')
      .select('created_at')
      .eq('user_id', userId)
      .eq('reason', action)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (lastError && lastError.code !== 'PGRST116') {
      console.error('Error checking last transaction:', lastError)
      return { isValid: false, reason: 'Erro de validação' }
    }

    // 3. Precise cooldown validation based on action type
    if (lastTransaction) {
      const lastActionTime = new Date(lastTransaction.created_at)
      const timeDiff = currentTime.getTime() - lastActionTime.getTime()
      const timeDiffSeconds = Math.floor(timeDiff / 1000)
      
      let requiredCooldown = 0 // in seconds
      let cooldownName = ''

      switch (action) {
        case 'scroll_page':
          requiredCooldown = 30 // 30 segundos
          cooldownName = '30 segundos'
          break
        case 'daily_login':
          // Check if it's the same day
          const lastActionDate = lastActionTime.toISOString().split('T')[0]
          const currentDate = currentTime.toISOString().split('T')[0]
          if (lastActionDate === currentDate) {
            console.log(`[BACKEND_CLOCK] Daily login already done today. Last: ${lastActionTime.toISOString()}, Current: ${currentTimestamp}`)
            return { 
              isValid: false, 
              reason: 'Login diário já realizado hoje',
              rateLimited: true
            }
          }
          break
        case 'page_visit':
          requiredCooldown = 1200 // 20 minutos = 1200 segundos
          cooldownName = '20 minutos'
          break
        default:
          requiredCooldown = rule.cooldown_minutes ? rule.cooldown_minutes * 60 : 60
          cooldownName = `${requiredCooldown} segundos`
      }

      if (requiredCooldown > 0 && timeDiffSeconds < requiredCooldown) {
        const remainingSeconds = requiredCooldown - timeDiffSeconds
        console.log(`[BACKEND_CLOCK] Cooldown not met. Last action: ${lastActionTime.toISOString()}, Current: ${currentTimestamp}, Required: ${requiredCooldown}s, Elapsed: ${timeDiffSeconds}s, Remaining: ${remainingSeconds}s`)
        return { 
          isValid: false, 
          reason: `Aguarde ${remainingSeconds} segundos para realizar esta ação novamente`,
          rateLimited: true
        }
      }
    }

    // 4. Check daily limits using precise backend counting
    if (rule.max_per_day) {
      const startOfDay = new Date(currentTime)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(currentTime)
      endOfDay.setHours(23, 59, 59, 999)

      const { data: todayTransactions, error: dailyError } = await supabase
        .from('coin_transactions')
        .select('id')
        .eq('user_id', userId)
        .eq('reason', action)
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())

      if (dailyError) {
        console.error('Error checking daily limits:', dailyError)
        return { isValid: false, reason: 'Erro de validação' }
      }

      const todayCount = todayTransactions?.length || 0
      console.log(`[BACKEND_CLOCK] Daily limit check: ${todayCount}/${rule.max_per_day} for action "${action}"`)
      
      if (todayCount >= rule.max_per_day) {
        return { 
          isValid: false, 
          reason: 'Limite diário atingido para esta ação',
          rateLimited: true
        }
      }
    }

    // 5. Rate limiting - check for suspicious rapid-fire requests
    const fiveMinutesAgo = new Date(currentTime.getTime() - 5 * 60 * 1000).toISOString()
    const { data: recentActions, error: recentError } = await supabase
      .from('coin_transactions')
      .select('created_at')
      .eq('user_id', userId)
      .eq('reason', action)
      .gte('created_at', fiveMinutesAgo)

    if (recentError) {
      console.error('Error checking recent actions:', recentError)
      return { isValid: false, reason: 'Erro de validação' }
    }

    // Check for suspicious patterns
    const suspiciousCheck = await checkSuspiciousActivity(supabase, userId, action, recentActions || [])
    if (suspiciousCheck.suspicious) {
      return {
        isValid: false,
        reason: 'Atividade suspeita detectada. Conta temporariamente restrita.',
        suspicious: true
      }
    }

    console.log(`[BACKEND_CLOCK] Action "${action}" validated successfully at ${currentTimestamp}`)
    return { isValid: true }

  } catch (error) {
    console.error('Validation error:', error)
    return { isValid: false, reason: 'Erro de validação' }
  }
}

async function checkSuspiciousActivity(
  supabase: any, 
  userId: string, 
  action: string, 
  recentActions: any[]
): Promise<{ suspicious: boolean; reason?: string }> {
  // Check for rapid-fire actions (more than 10 in last minute)
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()
  const actionsLastMinute = recentActions.filter(a => a.created_at >= oneMinuteAgo)
  
  if (actionsLastMinute.length > 10) {
    await flagSuspiciousUser(supabase, userId, 'rapid_fire_actions', {
      action,
      count: actionsLastMinute.length,
      timeframe: '1_minute'
    })
    return { suspicious: true, reason: 'Too many rapid actions' }
  }

  // Check for exact timing patterns (bot-like behavior)
  if (recentActions.length >= 5) {
    const timeDiffs = []
    for (let i = 1; i < Math.min(recentActions.length, 5); i++) {
      const diff = new Date(recentActions[i-1].created_at).getTime() - 
                   new Date(recentActions[i].created_at).getTime()
      timeDiffs.push(diff)
    }
    
    // Check if actions are too regular (within 100ms of each other)
    const avgDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length
    const variance = timeDiffs.reduce((acc, diff) => acc + Math.pow(diff - avgDiff, 2), 0) / timeDiffs.length
    
    if (variance < 10000) { // Very regular timing suggests automation
      await flagSuspiciousUser(supabase, userId, 'regular_timing_pattern', {
        action,
        avgDiff,
        variance,
        timeDiffs
      })
      return { suspicious: true, reason: 'Regular timing pattern detected' }
    }
  }

  return { suspicious: false }
}

async function flagSuspiciousUser(
  supabase: any, 
  userId: string, 
  flagType: string, 
  metadata: any
) {
  try {
    await supabase
      .from('security_flags')
      .insert({
        user_id: userId,
        flag_type: flagType,
        metadata,
        created_at: new Date().toISOString()
      })
    
    console.warn(`[SECURITY] User ${userId} flagged for: ${flagType}`)
  } catch (error) {
    console.error('Error flagging suspicious user:', error)
  }
}

async function logSecurityEvent(supabase: any, logData: SecurityLog) {
  try {
    await supabase
      .from('security_logs')
      .insert(logData)
  } catch (error) {
    console.error('Error logging security event:', error)
  }
}