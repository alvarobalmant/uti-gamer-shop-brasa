import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { Resend } from 'npm:resend@4.0.0';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const resendApiKey = Deno.env.get('RESEND_API_KEY');
console.log('Resend API Key present:', !!resendApiKey);
const resend = new Resend(resendApiKey);

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
    console.log('Headers:', req.headers);
    console.log('Method:', req.method);
    const payload = await req.text();
    console.log('Received payload:', payload.substring(0, 200) + '...');
    
    // Parse do webhook do Supabase Auth
    let webhookData;
    try {
      webhookData = JSON.parse(payload);
    } catch (error) {
      console.error('Error parsing webhook payload:', error);
      return new Response('Invalid JSON payload', { status: 400 });
    }

    const { user, email_data }: { user: User; email_data: EmailData } = webhookData;
    
    if (!user?.email || !email_data) {
      console.error('Missing required data in webhook payload');
      return new Response('Missing required data', { status: 400 });
    }

    console.log('Processing email for type:', email_data.email_action_type);

    // Buscar configurações de email
    console.log('Fetching email config...');
    const { data: emailConfig, error: configError } = await supabase
      .from('email_config')
      .select('*')
      .single();

    if (configError) {
      console.error('Error fetching email config:', configError);
      return new Response('Error fetching email config', { status: 500 });
    }

    if (!emailConfig) {
      console.error('Email config not found');
      return new Response('Email config not found', { status: 500 });
    }

    console.log('Email config found:', emailConfig.from_name);

    // Determinar tipo de template baseado na ação
    let templateType = 'confirmation';
    if (email_data.email_action_type === 'recovery') {
      templateType = 'reset_password';
    } else if (email_data.email_action_type === 'signup') {
      templateType = 'confirmation';
    }

    // Buscar template
    console.log('Fetching template for type:', templateType);
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('type', templateType)
      .eq('is_active', true)
      .single();

    if (templateError) {
      console.error('Error fetching template:', templateError);
      return new Response(`Error fetching template: ${templateError.message}`, { status: 500 });
    }

    if (!template) {
      console.error(`Template not found for type: ${templateType}`);
      return new Response(`Template not found for type: ${templateType}`, { status: 500 });
    }

    console.log('Template found:', template.name);

    // Preparar variáveis para o template
    const templateVariables = {
      from_name: emailConfig.from_name,
      logo_url: emailConfig.logo_url,
      primary_color: emailConfig.primary_color,
      company_address: emailConfig.company_address,
      user_name: user.user_metadata?.name || user.email.split('@')[0],
      user_email: user.email,
      subject: template.subject,
      confirmation_url: `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${email_data.redirect_to}`,
      reset_url: `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${email_data.redirect_to}`,
      platform_url: email_data.site_url || email_data.redirect_to,
    };

    // Processar templates
    const htmlContent = processTemplate(template.html_content, templateVariables);
    const textContent = template.text_content ? processTemplate(template.text_content, templateVariables) : undefined;
    const subject = processTemplate(template.subject, templateVariables);

    // Enviar email
    console.log('Sending email to:', user.email);
    console.log('Email subject:', subject);
    const emailResult = await resend.emails.send({
      from: `${emailConfig.from_name} <${emailConfig.from_email}>`,
      to: [user.email],
      subject: subject,
      html: htmlContent,
      text: textContent,
      reply_to: emailConfig.reply_to || undefined,
    });

    if (emailResult.error) {
      console.error('Error sending email:', emailResult.error);
      return new Response(
        JSON.stringify({ error: emailResult.error }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Email sent successfully:', emailResult.data);

    return new Response(
      JSON.stringify({ success: true, email_id: emailResult.data?.id }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in send-custom-emails function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});