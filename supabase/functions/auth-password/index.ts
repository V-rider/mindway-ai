
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Generate a random 16-byte salt as hex
function generateSalt(): string {
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  return Array.from(saltBytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Hash password with salt using SHA-256
async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  const hashHex = Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${salt}:${hashHex}`;
}

// Verify password against stored hash
async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    // Check if this is the temporary hash that needs migration
    if (storedHash === 'temp_salt:temp_hash') {
      console.error('Attempting to verify against temporary hash - password migration needed');
      return false;
    }

    const parts = storedHash.split(':');
    if (parts.length !== 2) {
      console.error('Invalid hash format - expected salt:hash format, got:', storedHash);
      return false;
    }
    
    const [salt, hash] = parts;
    if (!salt || !hash) {
      console.error('Invalid hash format - empty salt or hash');
      return false;
    }
    
    const computedHash = await hashPassword(password, salt);
    return computedHash === storedHash;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, password, storedHash } = await req.json();

    if (action === 'hash') {
      // Hash a new password
      if (!password) {
        return new Response(
          JSON.stringify({ error: 'Password is required for hashing' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const salt = generateSalt();
      const hashedPassword = await hashPassword(password, salt);
      
      return new Response(
        JSON.stringify({ hashedPassword }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'verify') {
      // Verify password against stored hash
      if (!password || !storedHash) {
        return new Response(
          JSON.stringify({ error: 'Password and stored hash are required for verification' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const isValid = await verifyPassword(password, storedHash);
      
      return new Response(
        JSON.stringify({ isValid }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Use "hash" or "verify".' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
