import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting force logout for all users...');

    // Get all users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error listing users:', usersError);
      return new Response(
        JSON.stringify({ error: 'Failed to list users' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${users.users.length} users to logout`);

    // Sign out each user from all devices
    const logoutPromises = users.users.map(async (user) => {
      try {
        const { error } = await supabase.auth.admin.signOut(user.id, 'global');
        if (error) {
          console.error(`Error signing out user ${user.email}:`, error);
        } else {
          console.log(`Successfully signed out user ${user.email}`);
        }
      } catch (err) {
        console.error(`Exception signing out user ${user.email}:`, err);
      }
    });

    await Promise.all(logoutPromises);

    console.log('Force logout completed for all users');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully signed out ${users.users.length} users from all devices`,
        userCount: users.users.length
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in force-logout-all:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});