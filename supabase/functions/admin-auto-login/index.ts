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
  console.log('Admin auto-login request received');

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

    console.log(`Validating admin token: ${token}`);

    // Validar o token usando a função do banco de dados
    const { data: validationResult, error: validationError } = await supabase
      .rpc('validate_admin_token', { 
        p_token: token, 
        p_ip: clientIP || req.headers.get('x-forwarded-for') || 'unknown'
      });

    if (validationError) {
      console.error('Validation error:', validationError);
      return new Response(
        JSON.stringify({ success: false, message: 'Erro na validação do token' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    if (!validationResult.success) {
      console.log('Token validation failed:', validationResult.message);
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

    console.log('Token validated successfully for admin user:', validationResult.admin_email);

    // Criar sessão direta sem magic link para evitar problemas de redirect
    try {
      console.log('Creating direct admin session...');
      
      // Buscar o usuário admin no banco
      const { data: adminUser, error: adminUserError } = await supabase.auth.admin.getUserById(validationResult.admin_user_id);
      
      if (adminUserError || !adminUser.user) {
        console.error('Error fetching admin user:', adminUserError);
        return new Response(
          JSON.stringify({ success: false, message: 'Usuário admin não encontrado' }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      console.log('Admin user found:', adminUser.user.email);

      // Usar abordagem alternativa: magic link para gerar tokens válidos
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: adminUser.user.email,
        options: {
          redirectTo: `${new URL(req.url).origin}/admin`
        }
      });

      if (linkError || !linkData) {
        console.error('Error generating magic link:', linkError);
        return new Response(
          JSON.stringify({ success: false, message: 'Erro ao gerar tokens de sessão' }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      console.log('Magic link generated for admin:', validationResult.admin_email);
      console.log('Link data:', JSON.stringify(linkData, null, 2));
      
      // Extrair tokens do link gerado
      let access_token = null;
      let refresh_token = null;
      
      try {
        // O link pode vir em diferentes formatos, vamos tentar extrair de todas as formas possíveis
        const actionLink = linkData.properties?.action_link || linkData.action_link;
        
        if (actionLink) {
          const url = new URL(actionLink);
          access_token = url.searchParams.get('access_token') || url.hash.match(/access_token=([^&]+)/)?.[1];
          refresh_token = url.searchParams.get('refresh_token') || url.hash.match(/refresh_token=([^&]+)/)?.[1];
        }
        
        // Se ainda não temos tokens, verificar se vêm diretamente nos dados
        if (!access_token && linkData.session) {
          access_token = linkData.session.access_token;
          refresh_token = linkData.session.refresh_token;
        }

        console.log('Token extraction attempt - Access token exists:', !!access_token, 'Refresh token exists:', !!refresh_token);

        if (!access_token || !refresh_token) {
          console.error('Failed to extract tokens from magic link');
          console.error('Link structure:', JSON.stringify(linkData, null, 2));
          return new Response(
            JSON.stringify({ success: false, message: 'Erro ao extrair tokens de sessão' }),
            { 
              status: 500, 
              headers: { 'Content-Type': 'application/json', ...corsHeaders } 
            }
          );
        }

        console.log('Tokens extracted successfully for admin:', validationResult.admin_email);
      } catch (extractError) {
        console.error('Error extracting tokens:', extractError);
        return new Response(
          JSON.stringify({ success: false, message: 'Erro no processamento dos tokens' }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      // Retornar tokens para login direto
      return new Response(
        JSON.stringify({
          success: true,
          sessionTokens: {
            access_token: access_token,
            refresh_token: refresh_token
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
      console.error('Error creating admin session:', authError);
      return new Response(
        JSON.stringify({ success: false, message: 'Erro ao criar sessão: ' + authError.message }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

  } catch (error: any) {
    console.error('Error in admin-auto-login function:', error);
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