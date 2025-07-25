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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== EMAIL WEBHOOK TRIGGERED ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    
    // Resposta simples para testar se a função está funcionando
    if (req.method === 'GET') {
      return new Response(
        JSON.stringify({ status: 'ok', message: 'Email webhook is working' }),
        { 
          status: 200,
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

    // Enviar email simples sem template customizado por enquanto
    console.log('Sending simple email...');
    
    const confirmationUrl = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${email_data.redirect_to}`;
    
    const subject = email_data.email_action_type === 'signup' ? 'Confirme seu email' : 'Recuperar senha';
    const actionText = email_data.email_action_type === 'signup' ? 'confirmar seu email' : 'redefinir sua senha';
    const buttonText = email_data.email_action_type === 'signup' ? 'Confirmar Email' : 'Redefinir Senha';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">Olá!</h1>
          <p>Você solicitou para ${actionText} em ${emailConfig.from_name}.</p>
          <p>Clique no botão abaixo para continuar:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              ${buttonText}
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Se você não solicitou esta ação, pode ignorar este email.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            ${emailConfig.from_name}<br>
            Este é um email automático, não responda.
          </p>
        </div>
      </body>
      </html>
    `;

    console.log('Sending email via Resend...');
    const emailResult = await resend.emails.send({
      from: `${emailConfig.from_name} <${emailConfig.from_email}>`,
      to: [user.email],
      subject: subject,
      html: htmlContent,
      reply_to: emailConfig.reply_to || undefined,
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