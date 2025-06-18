
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body text first
    const bodyText = await req.text();
    console.log('Request body text:', bodyText);
    
    if (!bodyText || bodyText.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Empty request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse the JSON
    const { password, hash } = JSON.parse(bodyText);

    if (!password || !hash) {
      return new Response(
        JSON.stringify({ error: 'Password and hash are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Verifying password with bcrypt hash');
    console.log('Hash format:', hash.substring(0, 10) + '...');
    
    // Use a simpler bcrypt verification approach
    // Import bcrypt dynamically to avoid Worker issues
    const bcryptModule = await import("https://deno.land/x/bcrypt@v0.4.1/mod.ts");
    
    // Verify the password against the bcrypt hash
    const isValid = await bcryptModule.compare(password, hash);
    
    console.log('Password verification result:', isValid);

    return new Response(
      JSON.stringify({ isValid }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in verify-password function:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
