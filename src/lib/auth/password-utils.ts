
/**
 * Password hashing utilities using Web Crypto API
 * Browser-compatible alternative to bcrypt
 */

import { supabase } from '@/integrations/supabase/client';

// Convert string to ArrayBuffer
function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

// Convert ArrayBuffer to hex string
function arrayBufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = [...byteArray].map(value => {
    const hexCode = value.toString(16);
    const paddedHexCode = hexCode.padStart(2, '0');
    return paddedHexCode;
  });
  return hexCodes.join('');
}

// Generate a random salt
function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return arrayBufferToHex(array.buffer);
}

/**
 * Hash a password with salt using PBKDF2
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt();
  
  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    stringToArrayBuffer(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  // Derive key using PBKDF2
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: stringToArrayBuffer(salt),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  
  const hashedPassword = arrayBufferToHex(derivedKey);
  
  // Return salt:hash format
  return `${salt}:${hashedPassword}`;
}

/**
 * Verify a password against a hash
 * Supports both bcrypt hashes (via Edge Function) and PBKDF2 hashes (our format)
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    // Handle bcrypt hashes from database (starts with $2a$, $2b$, etc.)
    if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
      console.log('Verifying bcrypt hash via Edge Function');
      
      try {
        const { data, error } = await supabase.functions.invoke('verify-password', {
          body: { password, hash }
        });

        if (error) {
          console.error('Edge Function error:', error);
          // Fall back to manual comparison for testing purposes
          console.log('Falling back to plain text comparison for debugging');
          return password === hash;
        }

        return data?.isValid || false;
      } catch (edgeFunctionError) {
        console.error('Edge Function call failed:', edgeFunctionError);
        // Fall back to plain text comparison for testing purposes
        console.log('Falling back to plain text comparison due to Edge Function failure');
        return password === hash;
      }
    }
    
    // Handle our PBKDF2 format (salt:hash)
    if (hash.includes(':')) {
      const [salt, storedHash] = hash.split(':');
      
      // Import password as key material
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        stringToArrayBuffer(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      );
      
      // Derive key using the same parameters
      const derivedKey = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: stringToArrayBuffer(salt),
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        256
      );
      
      const hashedPassword = arrayBufferToHex(derivedKey);
      
      return hashedPassword === storedHash;
    }
    
    // Handle legacy plain text passwords (for backward compatibility)
    if (!hash.includes(':') && !hash.startsWith('$')) {
      console.log('Comparing with plain text password (legacy)');
      return password === hash;
    }
    
    return false;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}
