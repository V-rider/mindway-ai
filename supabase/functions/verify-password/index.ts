
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password, hashedPassword } = await req.json();
    
    console.log('Verifying password...');
    
    if (!password || !hashedPassword) {
      return new Response(
        JSON.stringify({ error: 'Password and hashedPassword are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Use bcrypt to compare the plain text password with the hashed password
    const isValid = await bcrypt.compare(password, hashedPassword);
    
    console.log('Password verification result:', isValid);

    return new Response(
      JSON.stringify({ isValid }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Password verification error:', error);
    return new Response(
      JSON.stringify({ error: 'Password verification failed', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
