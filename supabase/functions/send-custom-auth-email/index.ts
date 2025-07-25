
import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { WelcomeEmail } from './_templates/welcome-email.tsx'
import { ResetPasswordEmail } from './_templates/reset-password-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

Deno.serve(async (req) => {
  console.log('Auth hook triggered:', req.method)
  
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const payload = await req.text()
    console.log('Received payload:', payload)
    
    const authData = JSON.parse(payload)
    console.log('Parsed auth data:', authData)

    const {
      user,
      email_data: { 
        token, 
        token_hash, 
        redirect_to, 
        email_action_type,
        site_url 
      },
    } = authData

    console.log('Processing email for:', {
      email: user.email,
      action: email_action_type,
      redirect_to,
      site_url
    })

    let emailHtml: string
    let subject: string

    // Determine which template to use based on the action type
    if (email_action_type === 'signup') {
      console.log('Rendering welcome email template')
      emailHtml = await renderAsync(
        React.createElement(WelcomeEmail, {
          supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
          token,
          token_hash,
          redirect_to,
          email_action_type,
          user_email: user.email,
          site_url,
        })
      )
      subject = 'Confirme seu e-mail para ativar sua conta'
    } else if (email_action_type === 'recovery') {
      console.log('Rendering reset password email template')
      emailHtml = await renderAsync(
        React.createElement(ResetPasswordEmail, {
          supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
          token,
          token_hash,
          redirect_to,
          email_action_type,
          user_email: user.email,
          site_url,
        })
      )
      subject = 'Redefinir sua senha'
    } else {
      console.log('Unknown email action type:', email_action_type)
      return new Response('Unknown email action type', { status: 400 })
    }

    console.log('Sending email via Resend...')
    const { data, error } = await resend.emails.send({
      from: 'UTI Games <noreply@utifinal.com>',
      to: [user.email],
      subject,
      html: emailHtml,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully:', data)
    
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in send-custom-auth-email function:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
          details: error.toString(),
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
