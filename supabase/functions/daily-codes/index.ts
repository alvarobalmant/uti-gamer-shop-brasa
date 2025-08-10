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
      return new Response(
        JSON.stringify({ success: false, message: 'Usuário não autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action, code } = await req.json()

    console.log(`[DAILY_CODES] User ${user.id} requesting action: ${action}`)

    switch (action) {
      case 'get_current_code':
        return await getCurrentCode(supabaseClient)
        
      case 'claim_code':
        if (!code) {
          return new Response(
            JSON.stringify({ success: false, message: 'Código é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        return await claimCode(supabaseClient, user.id, code)
        
      case 'get_streak_status':
        return await getStreakStatus(supabaseClient, user.id)
        
      default:
        return new Response(
          JSON.stringify({ success: false, message: 'Ação inválida' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('[DAILY_CODES] Error:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function getCurrentCode(supabase: any) {
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
          message: 'Nenhum código disponível ainda' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const currentCode: DailyCode = codes[0]
    const now = new Date()
    const claimableUntil = new Date(currentCode.claimable_until)
    const validUntil = new Date(currentCode.valid_until)

    // Calcular horas até expiração
    const hoursUntilClaimExpires = Math.max(0, Math.floor((claimableUntil.getTime() - now.getTime()) / (1000 * 60 * 60)))
    const hoursUntilValidityExpires = Math.max(0, Math.floor((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60)))

    const result = {
      success: true,
      data: {
        code: currentCode.code,
        created_at: currentCode.created_at,
        claimable_until: currentCode.claimable_until,
        valid_until: currentCode.valid_until,
        can_claim: now <= claimableUntil,
        is_valid: now <= validUntil,
        hours_until_claim_expires: hoursUntilClaimExpires,
        hours_until_validity_expires: hoursUntilValidityExpires
      }
    }

    console.log('[GET_CURRENT] Returning code:', result.data.code, 'can_claim:', result.data.can_claim)
    
    return new Response(
      JSON.stringify(result),
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
    // Verificar se código existe e pode ser resgatado
    const { data: codeData, error: codeError } = await supabase
      .from('daily_codes')
      .select('*')
      .eq('code', code)
      .single()

    if (codeError || !codeData) {
      console.log('[CLAIM_CODE] Code not found:', code)
      return new Response(
        JSON.stringify({ success: false, message: 'Código não encontrado' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const now = new Date()
    const claimableUntil = new Date(codeData.claimable_until)

    // Verificar se ainda pode ser resgatado (janela de 24h)
    if (now > claimableUntil) {
      console.log('[CLAIM_CODE] Code expired for claiming:', code)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Código não pode mais ser resgatado (período de 24h expirado)' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verificar se usuário já possui este código
    const { data: existingCode } = await supabase
      .from('user_daily_codes')
      .select('id')
      .eq('user_id', userId)
      .eq('code', code)
      .single()

    if (existingCode) {
      console.log('[CLAIM_CODE] Code already claimed by user:', userId, code)
      return new Response(
        JSON.stringify({ success: false, message: 'Código já foi resgatado anteriormente' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calcular próxima posição na streak
    const { data: userCodes } = await supabase
      .from('user_daily_codes')
      .select('streak_position')
      .eq('user_id', userId)
      .order('streak_position', { ascending: false })
      .limit(1)

    const nextPosition = userCodes && userCodes.length > 0 ? userCodes[0].streak_position + 1 : 1

    // Adicionar código à tabela pessoal
    const { error: insertError } = await supabase
      .from('user_daily_codes')
      .insert({
        user_id: userId,
        code: code,
        expires_at: codeData.valid_until,
        streak_position: nextPosition
      })

    if (insertError) {
      console.error('[CLAIM_CODE] Insert error:', insertError)
      return new Response(
        JSON.stringify({ success: false, message: 'Erro ao resgatar código' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Dar moedas UTI para o usuário
    const baseAmount = 10
    const streakMultiplier = Math.min(1 + (nextPosition - 1) * 0.1, 3.0)
    const finalAmount = Math.floor(baseAmount * streakMultiplier)

    // Inserir transação de moedas
    await supabase
      .from('coin_transactions')
      .insert({
        user_id: userId,
        amount: finalAmount,
        type: 'earned',
        reason: 'daily_code_claim',
        description: `Código resgatado: ${code} (Sequência ${nextPosition})`,
        metadata: {
          code: code,
          streak_position: nextPosition,
          multiplier: streakMultiplier,
          new_system: true
        }
      })

    // Atualizar saldo
    await supabase
      .from('uti_coins')
      .insert({
        user_id: userId,
        balance: finalAmount,
        total_earned: finalAmount
      })
      .onConflict('user_id')
      .set({
        balance: supabase.raw('balance + ?', [finalAmount]),
        total_earned: supabase.raw('total_earned + ?', [finalAmount]),
        updated_at: new Date().toISOString()
      })

    console.log(`[CLAIM_CODE] Success! User ${userId} claimed code ${code}, position ${nextPosition}, earned ${finalAmount} coins`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Código resgatado com sucesso!',
        data: {
          streak_position: nextPosition,
          coins_earned: finalAmount,
          multiplier: streakMultiplier
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[CLAIM_CODE] Error:', error)
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
      success: true,
      data: {
        has_active_streak: hasActiveStreak,
        streak_count: streakCount,
        valid_codes_count: codes.length,
        codes: codes
      }
    }

    console.log(`[GET_STREAK] User ${userId} streak: ${streakCount}, valid codes: ${codes.length}`)

    return new Response(
      JSON.stringify(result),
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