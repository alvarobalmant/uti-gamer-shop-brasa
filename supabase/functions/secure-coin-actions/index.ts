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
    // 1. Check if action exists and is active
    const { data: rule, error: ruleError } = await supabase
      .from('coin_rules')
      .select('*')
      .eq('action', action)
      .eq('is_active', true)
      .single()

    if (ruleError || !rule) {
      return { isValid: false, reason: 'Ação não autorizada' }
    }

    // 2. Rate limiting - check recent actions (last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { data: recentActions, error: recentError } = await supabase
      .from('coin_transactions')
      .select('created_at, metadata')
      .eq('user_id', userId)
      .eq('reason', action)
      .gte('created_at', fiveMinutesAgo)
      .order('created_at', { ascending: false })

    if (recentError) {
      console.error('Error checking recent actions:', recentError)
      return { isValid: false, reason: 'Erro de validação' }
    }

    // 3. Specific action validations
    switch (action) {
      case 'scroll_page':
        // Allow max 1 scroll reward per 30 seconds
        const thirtySecondsAgo = new Date(Date.now() - 30 * 1000).toISOString()
        const recentScrolls = recentActions?.filter(a => 
          a.created_at >= thirtySecondsAgo
        ) || []
        
        if (recentScrolls.length > 0) {
          return { 
            isValid: false, 
            reason: 'Aguarde 30 segundos entre ações de scroll',
            rateLimited: true
          }
        }

        // Check for suspicious rapid scrolling (more than 5 in 5 minutes)
        if (recentActions && recentActions.length >= 5) {
          return {
            isValid: false,
            reason: 'Muitas ações de scroll detectadas. Aguarde antes de tentar novamente.',
            suspicious: true,
            rateLimited: true
          }
        }
        break

      case 'daily_login':
        // Only allow once per day
        const today = new Date().toISOString().split('T')[0]
        const todayLogins = recentActions?.filter(a => 
          a.created_at.split('T')[0] === today
        ) || []
        
        if (todayLogins.length > 0) {
          return { 
            isValid: false, 
            reason: 'Login diário já realizado hoje',
            rateLimited: true
          }
        }
        break

      case 'page_visit':
        // Allow max 3 per hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
        const recentVisits = recentActions?.filter(a => 
          a.created_at >= oneHourAgo
        ) || []
        
        if (recentVisits.length >= 3) {
          return { 
            isValid: false, 
            reason: 'Limite de visitas por hora atingido',
            rateLimited: true
          }
        }
        break

      default:
        // For unknown actions, apply conservative rate limiting
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()
        const veryRecentActions = recentActions?.filter(a => 
          a.created_at >= oneMinuteAgo
        ) || []
        
        if (veryRecentActions.length > 0) {
          return { 
            isValid: false, 
            reason: 'Ação muito frequente. Aguarde um momento.',
            rateLimited: true
          }
        }
    }

    // 4. Check daily limits
    if (rule.max_per_day) {
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      
      const { data: dailyActions, error: dailyError } = await supabase
        .from('daily_actions')
        .select('count')
        .eq('user_id', userId)
        .eq('action', action)
        .eq('action_date', startOfDay.toISOString().split('T')[0])
        .single()

      if (dailyError && dailyError.code !== 'PGRST116') {
        console.error('Error checking daily limits:', dailyError)
        return { isValid: false, reason: 'Erro de validação' }
      }

      const dailyCount = dailyActions?.count || 0
      if (dailyCount >= rule.max_per_day) {
        return { 
          isValid: false, 
          reason: 'Limite diário atingido para esta ação',
          rateLimited: true
        }
      }
    }

    // 5. Check for suspicious patterns
    const suspiciousCheck = await checkSuspiciousActivity(supabase, userId, action, recentActions || [])
    if (suspiciousCheck.suspicious) {
      return {
        isValid: false,
        reason: 'Atividade suspeita detectada. Conta temporariamente restrita.',
        suspicious: true
      }
    }

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