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

    // ABORDAGEM CORRIGIDA: Usar generateLink para criar sessão válida
    try {
      console.log('🔐 Creating admin session using generateLink...');

      // Gerar link de login mágico para o admin
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: validationResult.admin_email,
        options: {
          redirectTo: 'http://localhost:3000/admin'
        }
      });

      if (linkError) {
        console.error('❌ Error generating magic link:', linkError);
        return new Response(
          JSON.stringify({ success: false, message: 'Erro ao gerar link de acesso' }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      if (!linkData.user || !linkData.session) {
        console.error('❌ No session data in magic link response');
        return new Response(
          JSON.stringify({ success: false, message: 'Dados de sessão não encontrados' }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      console.log('✅ Admin session created successfully via generateLink!');

      // Retornar os tokens da sessão criada
      return new Response(
        JSON.stringify({
          success: true,
          sessionTokens: {
            access_token: linkData.session.access_token,
            refresh_token: linkData.session.refresh_token
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