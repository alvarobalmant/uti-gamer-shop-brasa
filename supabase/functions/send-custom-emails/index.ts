import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { Resend } from 'npm:resend@4.0.0';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailData {
  token: string;
  token_hash: string;
  redirect_to: string;
  email_action_type: string;
  site_url: string;
}

interface User {
  email: string;
  email_confirmed_at?: string;
  user_metadata?: {
    name?: string;
  };
}

// Template engine simples para substituir variáveis
function processTemplate(template: string, variables: Record<string, any>): string {
  let processed = template;
  
  // Substituir variáveis simples {{variable}}
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    processed = processed.replace(regex, value || '');
  });
  
  // Processar condicionais simples {{#if variable}}content{{/if}}
  processed = processed.replace(/{{#if\s+(\w+)}}(.*?){{\/if}}/gs, (match, variable, content) => {
    return variables[variable] ? content : '';
  });
  
  return processed;
}

serve(async (req) => {
  // Handle CORS preflight requests first
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== EMAIL WEBHOOK TRIGGERED ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', Object.fromEntries(req.headers.entries()));
    
    // Test endpoint to verify function is working
    if (req.method === 'GET') {
      return new Response(
        JSON.stringify({ status: 'ok', message: 'Email webhook is working', timestamp: new Date().toISOString() }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Only handle POST requests for webhooks
    if (req.method !== 'POST') {
      console.log('Invalid method:', req.method);
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const payload = await req.text();
    console.log('Payload length:', payload.length);
    console.log('Payload preview:', payload.substring(0, 200) + '...');
    
    // Parse do webhook do Supabase Auth
    let webhookData;
    try {
      webhookData = JSON.parse(payload);
      console.log('Webhook data parsed successfully');
    } catch (error) {
      console.error('Error parsing webhook payload:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { user, email_data }: { user: User; email_data: EmailData } = webhookData;
    
    if (!user?.email || !email_data) {
      console.error('Missing required data in webhook payload');
      console.log('User:', user ? 'exists' : 'missing');
      console.log('Email data:', email_data ? 'exists' : 'missing');
      return new Response(
        JSON.stringify({ error: 'Missing required data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing email for type:', email_data.email_action_type);
    console.log('User email:', user.email);

    // Buscar configurações de email
    console.log('Fetching email config...');
    const { data: emailConfig, error: configError } = await supabase
      .from('email_config')
      .select('*')
      .single();

    if (configError) {
      console.error('Error fetching email config:', configError);
      return new Response(
        JSON.stringify({ error: 'Error fetching email config', details: configError }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!emailConfig) {
      console.error('Email config not found');
      return new Response(
        JSON.stringify({ error: 'Email config not found' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Email config found:', emailConfig.from_email);

    // Construir email moderno e profissional
    const confirmationUrl = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${email_data.redirect_to}`;
    
    const subject = email_data.email_action_type === 'signup' ? 
      '🎮 Confirme seu email - UTI dos Games' : 
      '🔐 Redefinir senha - UTI dos Games';
    
    const actionText = email_data.email_action_type === 'signup' ? 
      'confirmar seu email' : 
      'redefinir sua senha';
    
    const buttonText = email_data.email_action_type === 'signup' ? 
      'Confirmar Email' : 
      'Redefinir Senha';

    const welcomeMessage = email_data.email_action_type === 'signup' ? 
      `<p style="font-size: 16px; margin-bottom: 20px;">Bem-vindo à <strong>UTI dos Games</strong>! 🎮</p>
       <p style="color: #666; margin-bottom: 25px;">Para começar a desfrutar de todas as funcionalidades exclusivas como UTI Coins, UTI Pro e muito mais, você precisa confirmar seu email.</p>` :
      `<p style="font-size: 16px; margin-bottom: 20px;">Solicitação de redefinição de senha recebida 🔐</p>
       <p style="color: #666; margin-bottom: 25px;">Clique no botão abaixo para redefinir sua senha. Se você não solicitou esta ação, pode ignorar este email.</p>`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
          .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 40px 20px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .button:hover { background: linear-gradient(135deg, #1d4ed8, #6d28d9); }
          .footer { background: #f8fafc; padding: 30px; text-align: center; color: #666; border-top: 1px solid #e2e8f0; }
          .features { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0; }
          .feature-item { display: flex; align-items: center; margin: 10px 0; }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f1f5f9;">
        <div class="container">
          <div class="header">
            <h1 class="logo">🎮 UTI dos Games</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0;">Sua plataforma de jogos favorita</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1e293b; margin-bottom: 20px;">Olá!</h2>
            
            ${welcomeMessage}
            
            ${email_data.email_action_type === 'signup' ? `
            <div class="features">
              <h3 style="color: #2563eb; margin-top: 0;">🚀 O que você terá acesso:</h3>
              <div class="feature-item">✨ UTI Coins para resgatar jogos grátis</div>
              <div class="feature-item">🏆 UTI Pro com descontos exclusivos</div>
              <div class="feature-item">🎯 Acesso antecipado a promoções</div>
              <div class="feature-item">🎮 Catálogo completo de jogos</div>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" class="button" style="color: white;">
                ${buttonText} →
              </a>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
              Se o botão não funcionar, copie e cole este link no seu navegador:
              <br>
              <a href="${confirmationUrl}" style="color: #2563eb; word-break: break-all;">${confirmationUrl}</a>
            </p>
            
            <p style="color: #94a3b8; font-size: 13px; margin-top: 25px;">
              Se você não solicitou esta ação, pode ignorar este email com segurança.
            </p>
          </div>
          
          <div class="footer">
            <p style="margin: 0 0 10px 0;"><strong>UTI dos Games</strong></p>
            <p style="margin: 0; font-size: 14px;">
              Este é um email automático, não responda.
              <br>
              <a href="mailto:contato@utidosgames.com" style="color: #2563eb;">contato@utidosgames.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log('Sending modern email...');
    const emailResult = await resend.emails.send({
      from: `UTI dos Games <noreply@utidosgames.com>`,
      to: [user.email],
      subject: subject,
      html: htmlContent,
      reply_to: 'contato@utidosgames.com',
    });

    if (emailResult.error) {
      console.error('Error sending email:', emailResult.error);
      return new Response(
        JSON.stringify({ error: 'Error sending email', details: emailResult.error }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Email sent successfully:', emailResult.data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        email_id: emailResult.data?.id,
        message: 'Email sent successfully'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in send-custom-emails function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message,
        stack: error.stack 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});