
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
  Img,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  user_email: string
  site_url: string
}

export const WelcomeEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  user_email,
  site_url,
}: WelcomeEmailProps) => {
  const confirmationUrl = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`

  return (
    <Html>
      <Head />
      <Preview>Confirme seu e-mail para ativar sua conta</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Bem-vindo!</Heading>
            <Text style={subtitle}>
              Obrigado por se cadastrar. Confirme seu e-mail para começar.
            </Text>
          </Section>

          <Section style={content}>
            <Text style={text}>
              Olá! Você se cadastrou com o e-mail <strong>{user_email}</strong>
            </Text>
            
            <Text style={text}>
              Para ativar sua conta e começar a usar nossos serviços, clique no botão abaixo:
            </Text>

            <Section style={buttonContainer}>
              <Link
                href={confirmationUrl}
                style={button}
              >
                Confirmar E-mail
              </Link>
            </Section>

            <Text style={text}>
              Se o botão não funcionar, copie e cole este link no seu navegador:
            </Text>
            
            <Text style={linkText}>
              {confirmationUrl}
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Se você não criou uma conta, pode ignorar este e-mail com segurança.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const header = {
  padding: '0 48px',
  textAlign: 'center' as const,
}

const content = {
  padding: '0 48px',
}

const h1 = {
  color: '#333',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0',
}

const subtitle = {
  color: '#666',
  fontSize: '16px',
  margin: '0 0 40px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  margin: '0 auto',
}

const linkText = {
  color: '#666',
  fontSize: '14px',
  backgroundColor: '#f4f4f4',
  padding: '16px',
  borderRadius: '4px',
  wordBreak: 'break-all' as const,
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
}

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px',
}
