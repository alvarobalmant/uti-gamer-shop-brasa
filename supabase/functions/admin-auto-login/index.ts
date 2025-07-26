import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface AutoLoginRequest {
  token: string;
  clientIP?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('🚀 Admin auto-login request received');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, message: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }

  try {
    const { token, clientIP }: AutoLoginRequest = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: 'Token é obrigatório' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    console.log(`🔍 Validating admin token: ${token}`);

    // Validar o token usando a função do banco de dados
    const { data: validationResult, error: validationError } = await supabase
      .rpc('validate_admin_token', { 
        p_token: token, 
        p_ip: clientIP || req.headers.get('x-forwarded-for') || 'unknown'
      });

    if (validationError) {
      console.error('❌ Validation error:', validationError);
      return new Response(
        JSON.stringify({ success: false, message: 'Erro na validação do token' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    if (!validationResult.success) {
      console.log('❌ Token validation failed:', validationResult.message);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: validationResult.message 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    console.log('✅ Token validated successfully for admin user:', validationResult.admin_email);

    // NOVA ABORDAGEM: Usar signInWithPassword diretamente
    // Primeiro, buscar o email do admin e resetar a senha temporariamente
    try {
      console.log('🔐 Creating temporary admin session...');

      // Abordagem mais simples: usar o email admin para fazer signIn direto
      const adminEmail = validationResult.admin_email;
      
      // Gerar uma nova senha temporária
      const tempPassword = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('🔄 Updating admin user password temporarily...');
      
      // Atualizar a senha do usuário admin temporariamente
      const { data: updateResult, error: updateError } = await supabase.auth.admin.updateUserById(
        validationResult.admin_user_id,
        { password: tempPassword }
      );

      if (updateError) {
        console.error('❌ Error updating admin password:', updateError);
        return new Response(
          JSON.stringify({ success: false, message: 'Erro ao preparar sessão administrativa' }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      console.log('✅ Admin password updated, now signing in...');

      // Fazer o signIn com as credenciais temporárias
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: tempPassword
      });

      if (signInError) {
        console.error('❌ Error signing in admin:', signInError);
        return new Response(
          JSON.stringify({ success: false, message: 'Erro ao criar sessão administrativa' }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      if (!signInData.session) {
        console.error('❌ No session created');
        return new Response(
          JSON.stringify({ success: false, message: 'Sessão não foi criada' }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      console.log('✅ Admin session created successfully!');

      // Restaurar a senha original (babyshark123)
      setTimeout(async () => {
        try {
          await supabase.auth.admin.updateUserById(
            validationResult.admin_user_id,
            { password: 'babyshark123' }
          );
          console.log('🔄 Admin password restored to original');
        } catch (error) {
          console.error('⚠️ Warning: Could not restore admin password:', error);
        }
      }, 5000); // Restaurar após 5 segundos

      // Retornar os tokens da sessão criada
      return new Response(
        JSON.stringify({
          success: true,
          sessionTokens: {
            access_token: signInData.session.access_token,
            refresh_token: signInData.session.refresh_token
          },
          adminEmail: validationResult.admin_email,
          adminUserId: validationResult.admin_user_id,
          message: 'Sessão administrativa criada com sucesso'
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );

    } catch (authError: any) {
      console.error('❌ Error in auth process:', authError);
      return new Response(
        JSON.stringify({ success: false, message: 'Erro ao criar sessão: ' + authError.message }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

  } catch (error: any) {
    console.error('❌ Error in admin-auto-login function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Erro interno do servidor' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);