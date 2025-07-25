import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 SIMPLE TEST VERSION STARTED');
    
    // Log básico
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    
    // Testar se consegue ler o payload
    const payload = await req.text();
    console.log('✅ Payload length:', payload.length);
    
    // Testar se as variáveis de ambiente existem
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendKey = Deno.env.get('RESEND_API_KEY');
    
    console.log('Supabase URL exists:', !!supabaseUrl);
    console.log('Supabase Key exists:', !!supabaseKey);
    console.log('Resend Key exists:', !!resendKey);
    
    if (!resendKey) {
      console.log('❌ RESEND_API_KEY missing');
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Testar parse do JSON
    try {
      const data = JSON.parse(payload);
      console.log('✅ JSON parsed successfully');
      console.log('User email:', data?.user?.email);
      console.log('Email action:', data?.email_data?.email_action_type);
    } catch (e) {
      console.log('❌ JSON parse error:', e.message);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON: ' + e.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log('✅ Basic tests passed');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Function is working - basic test passed',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ CRITICAL ERROR:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Critical error: ' + error.message,
        stack: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});