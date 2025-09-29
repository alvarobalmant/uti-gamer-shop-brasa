import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DailyCode {
  id: number;
  code: string;
  created_at: string;
  claimable_until: string;
  valid_until: string;
}

interface UserCode {
  id: number;
  user_id: string;
  code: string;
  added_at: string;
  expires_at: string;
  streak_position: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get authorization header
    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '') || ''
    
    // Get user from JWT
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader)
    
    if (userError || !user) {
      console.error('[DAILY_CODES] Auth error:', userError)
      return new Response(
        JSON.stringify({ success: false, message: 'Usuário não autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action, code } = await req.json()

    console.log(`[DAILY_CODES] User ${user.id} requesting action: ${action}`)

    switch (action) {
      case 'get_current_code':
        return await getCurrentCode(supabaseClient, user.id)
        
      case 'claim_code':
        if (!code) {
          return new Response(
            JSON.stringify({ success: false, message: 'Código é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        return await claimCode(supabaseClient, user.id, code)
        
      case 'claim_daily_bonus':
        return await claimDailyBonus(supabaseClient, user.id)
        
      case 'get_streak_status':
        return await getStreakStatus(supabaseClient, user.id)
        
      default:
        return new Response(
          JSON.stringify({ success: false, message: 'Ação inválida' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('[DAILY_CODES] Main Error:', error)
    console.error('[DAILY_CODES] Error Details:', {
      message: error?.message,
      stack: error?.stack,
      code: error?.code,
      details: error?.details
    })
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Erro interno do servidor',
        debug: error?.message || 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function getCurrentCode(supabase: any, userId?: string) {
  console.log('[GET_CURRENT] Fetching current daily code')
  
  try {
    // Buscar código mais recente
    const { data: codes, error } = await supabase
      .from('daily_codes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      console.error('[GET_CURRENT] Database error:', error)
      return new Response(
        JSON.stringify({ success: false, message: 'Erro ao buscar código' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!codes || codes.length === 0) {
      console.log('[GET_CURRENT] No codes found')
      return new Response(
        JSON.stringify({
          success: true,
          data: null,
          message: 'Nenhum código disponível'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const currentCode = codes[0]
    const now = new Date()
    const claimableUntil = new Date(currentCode.claimable_until)
    const validUntil = new Date(currentCode.valid_until)

    const canClaim = now <= claimableUntil
    const isValid = now <= validUntil

    // Calcular tempo restante para resgatar
    const timeUntilClaimExpires = Math.max(0, Math.floor((claimableUntil.getTime() - now.getTime()) / (1000 * 60 * 60)))
    const timeUntilValidityExpires = Math.max(0, Math.floor((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60)))

    console.log(`[GET_CURRENT] Returning code: ${currentCode.code} can_claim: ${canClaim}`)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          code: currentCode.code,
          created_at: currentCode.created_at,
          claimable_until: currentCode.claimable_until,
          valid_until: currentCode.valid_until,
          can_claim: canClaim,
          is_valid: isValid,
          hours_until_claim_expires: timeUntilClaimExpires,
          hours_until_validity_expires: timeUntilValidityExpires
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[GET_CURRENT] Error:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Erro interno' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function claimCode(supabase: any, userId: string, code: string) {
  console.log(`[CLAIM_CODE] User ${userId} attempting to claim code: ${code}`)
  
  try {
    // VERIFICAÇÃO INICIAL: usar função de debug para validar
    console.log(`[CLAIM_CODE] Running validation for user ${userId} and code ${code}`)
    
    const { data: debugResult, error: debugError } = await supabase
      .rpc('debug_daily_codes_issue', {
        p_user_id: userId,
        p_code: code
      })
    
    if (debugError) {
      console.error('[CLAIM_CODE] Debug validation error:', debugError)
      return new Response(
        JSON.stringify({ success: false, message: 'Erro ao validar código' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    console.log('[CLAIM_CODE] Validation result:', debugResult)
    
    // Verificar erros da validação
    if (debugResult.error) {
      const errorMsg = debugResult.error === 'code_not_found' 
        ? 'Código não encontrado' 
        : debugResult.error === 'code_already_claimed'
        ? 'Código já foi resgatado anteriormente'
        : 'Erro desconhecido na validação'
      
      console.log(`[CLAIM_CODE] Validation failed: ${debugResult.error}`)
      return new Response(
        JSON.stringify({ success: false, message: errorMsg }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Verificar se pode resgatar
    if (!debugResult.can_claim) {
      console.log('[CLAIM_CODE] Cannot claim - user already has code today')
      return new Response(
        JSON.stringify({ success: false, message: 'Já resgatou um código hoje' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Verificar se está dentro da janela de resgate
    if (!debugResult.is_within_claim_window) {
      console.log('[CLAIM_CODE] Outside claim window')
      return new Response(
        JSON.stringify({ success: false, message: 'Período de resgate expirado' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Carregar configurações do sistema para calcular recompensa
    const { data: configData, error: configError } = await supabase
      .from('coin_system_config')
      .select('setting_key, setting_value')
      .in('setting_key', ['daily_bonus_base_amount', 'daily_bonus_max_amount', 'daily_bonus_streak_days', 'daily_bonus_increment_type', 'daily_bonus_fixed_increment'])

    let baseAmount = 30
    let maxAmount = 70
    let streakDays = 7
    let incrementType = 'calculated'
    let fixedIncrement = 10

    if (!configError && configData) {
      const configMap: any = {}
      configData.forEach(item => {
        configMap[item.setting_key] = item.setting_value
      })
      
      baseAmount = parseInt(configMap.daily_bonus_base_amount || '30')
      maxAmount = parseInt(configMap.daily_bonus_max_amount || '70')
      streakDays = parseInt(configMap.daily_bonus_streak_days || '7')
      incrementType = configMap.daily_bonus_increment_type || 'calculated'
      fixedIncrement = parseInt(configMap.daily_bonus_fixed_increment || '10')
    }

    console.log(`[CLAIM_CODE] Config loaded - Base: ${baseAmount}, Max: ${maxAmount}, Cycle: ${streakDays} days, Type: ${incrementType}`)

    // Buscar códigos do usuário para calcular sequência
    const { data: userCodes, error: userCodesError } = await supabase
      .from('user_daily_codes')
      .select('*')
      .eq('user_id', userId)
      .order('added_at', { ascending: false })

    if (userCodesError) {
      console.error('[CLAIM_CODE] Error fetching user codes:', userCodesError)
      return new Response(
        JSON.stringify({ success: false, message: 'Erro ao verificar códigos do usuário' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calcular próxima posição na sequência
    let nextPosition = 1
    if (userCodes && userCodes.length > 0) {
      const lastCode = userCodes[0]
      const lastDate = new Date(lastCode.added_at)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      lastDate.setHours(0, 0, 0, 0)
      
      const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 1) {
        // Consecutivo - continua sequência com ciclo
        const rawPosition = lastCode.streak_position + 1
        nextPosition = ((rawPosition - 1) % streakDays) + 1
        console.log(`[CLAIM_CODE] Consecutive day - raw position: ${rawPosition}, cycle position: ${nextPosition}`)
      } else if (daysDiff > 1) {
        // Perdeu sequência - reinicia
        nextPosition = 1
        console.log(`[CLAIM_CODE] Streak broken (${daysDiff} days gap) - restarting at position 1`)
      }
    }

    // Calcular quantidade de coins baseado na configuração
    let finalAmount: number
    
    if (incrementType === 'fixed') {
      // Incremento fixo
      finalAmount = Math.min(baseAmount + ((nextPosition - 1) * fixedIncrement), maxAmount)
    } else {
      // Incremento calculado (progressivo)
      if (streakDays > 1) {
        finalAmount = baseAmount + Math.round(((maxAmount - baseAmount) * (nextPosition - 1)) / (streakDays - 1))
      } else {
        finalAmount = baseAmount
      }
    }

    // Garantir que não excede o máximo
    finalAmount = Math.min(finalAmount, maxAmount)

    console.log(`[CLAIM_CODE] User ${userId} at cycle position ${nextPosition}/${streakDays}, earning ${finalAmount} coins (type: ${incrementType})`)

    // Adicionar código à tabela pessoal
    const { error: insertError } = await supabase
      .from('user_daily_codes')
      .insert({
        user_id: userId,
        code: code,
        expires_at: debugResult.code_info.valid_until,
        streak_position: nextPosition
      })

    if (insertError) {
      console.error('[CLAIM_CODE] Insert error:', insertError)
      return new Response(
        JSON.stringify({ success: false, message: 'Erro ao resgatar código' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Inserir transação de moedas
    const { error: transactionError } = await supabase
      .from('coin_transactions')
      .insert({
        user_id: userId,
        amount: finalAmount,
        type: 'earned',
        reason: 'daily_code_claim',
        description: `Código resgatado: ${code} (Sequência ${nextPosition}/${streakDays})`,
        metadata: {
          code: code,
          streak_position: nextPosition,
          streak_days: streakDays,
          increment_type: incrementType,
          daily_code_claim: true,
          config_used: {
            base_amount: baseAmount,
            max_amount: maxAmount,
            streak_days: streakDays,
            increment_type: incrementType,
            fixed_increment: fixedIncrement
          }
        }
      })

    if (transactionError) {
      console.error('[CLAIM_CODE] Transaction error:', transactionError)
      // Tentar remover código inserido se falhou
      await supabase
        .from('user_daily_codes')
        .delete()
        .eq('user_id', userId)
        .eq('code', code)
      
      return new Response(
        JSON.stringify({ success: false, message: 'Erro ao processar transação' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Atualizar saldo usando função RPC
    console.log(`[CLAIM_CODE] Updating balance for user ${userId} with ${finalAmount} coins`)
    
    const { error: balanceError } = await supabase.rpc('update_user_balance', {
      p_user_id: userId,
      p_amount: finalAmount
    })

    if (balanceError) {
      console.error('[CLAIM_CODE] Balance update error:', balanceError)
      return new Response(
        JSON.stringify({ success: false, message: 'Erro ao atualizar saldo' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`[CLAIM_CODE] Success! User ${userId} claimed code ${code}, position ${nextPosition}, earned ${finalAmount} coins`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Código resgatado com sucesso!',
        data: {
          streak_position: nextPosition,
          streak_days: streakDays,
          coins_earned: finalAmount,
          increment_type: incrementType,
          config_applied: {
            base_amount: baseAmount,
            max_amount: maxAmount,
            cycle_days: streakDays
          }
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[CLAIM_CODE] Critical Error:', error)
    console.error('[CLAIM_CODE] Error Details:', {
      message: error?.message,
      stack: error?.stack,
      code: error?.code,
      details: error?.details
    })
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Erro interno do servidor',
        debug: error?.message || 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function claimDailyBonus(supabase: any, userId: string) {
  console.log(`[CLAIM_DAILY_BONUS] User ${userId} attempting to auto-claim today's code`)
  
  try {
    // Buscar código atual
    const { data: codes, error } = await supabase
      .from('daily_codes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)

    if (error || !codes || codes.length === 0) {
      console.log('[CLAIM_DAILY_BONUS] No current code available')
      return new Response(
        JSON.stringify({ success: false, message: 'Nenhum código disponível para resgate automático' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const currentCode = codes[0].code
    console.log(`[CLAIM_DAILY_BONUS] Auto-claiming current code: ${currentCode}`)
    
    // Usar a função de claim normal
    return await claimCode(supabase, userId, currentCode)

  } catch (error) {
    console.error('[CLAIM_DAILY_BONUS] Error:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Erro interno' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function getStreakStatus(supabase: any, userId: string) {
  console.log(`[GET_STREAK] Getting streak status for user ${userId}`)
  
  try {
    const now = new Date()

    // Buscar códigos válidos do usuário
    const { data: validCodes } = await supabase
      .from('user_daily_codes')
      .select('*')
      .eq('user_id', userId)
      .gt('expires_at', now.toISOString())
      .order('streak_position', { ascending: true })

    const hasActiveStreak = validCodes && validCodes.length > 0
    const streakCount = hasActiveStreak ? Math.max(...validCodes.map((c: UserCode) => c.streak_position)) : 0

    // Formatar códigos para resposta
    const codes = validCodes ? validCodes.map((c: UserCode) => {
      const expiresAt = new Date(c.expires_at)
      const hoursUntilExpiry = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)))
      
      return {
        code: c.code,
        added_at: c.added_at,
        expires_at: c.expires_at,
        streak_position: c.streak_position,
        hours_until_expiry: hoursUntilExpiry
      }
    }) : []

    const result = {
      has_active_streak: hasActiveStreak,
      streak_count: streakCount,
      valid_codes_count: codes.length,
      codes: codes
    }

    console.log(`[GET_STREAK] User ${userId} streak: ${streakCount}, valid codes: ${codes.length}`)

    return new Response(
      JSON.stringify({
        success: true,
        data: result
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[GET_STREAK] Error:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Erro interno' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}