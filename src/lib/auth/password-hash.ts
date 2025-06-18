
// Browser-compatible password hashing using Web Crypto API
const SALT_LENGTH = 16;
const ITERATIONS = 100000; // PBKDF2 iterations

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

// Convert hex string to ArrayBuffer
function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
}

// Generate random salt
function generateSalt(): ArrayBuffer {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

export const passwordHash = {
  // Hash a plain text password using PBKDF2
  async hash(password: string): Promise<string> {
    try {
      const salt = generateSalt();
      const passwordBuffer = stringToArrayBuffer(password);
      
      // Import password as key material
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        'PBKDF2',
        false,
        ['deriveBits']
      );
      
      // Derive key using PBKDF2
      const derivedKey = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: ITERATIONS,
          hash: 'SHA-256'
        },
        keyMaterial,
        256 // 32 bytes
      );
      
      // Combine salt and hash
      const saltHex = arrayBufferToHex(salt);
      const hashHex = arrayBufferToHex(derivedKey);
      
      return `${saltHex}:${hashHex}`;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Failed to hash password');
    }
  },

  // Compare a plain text password with a hashed password
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const [saltHex, hashHex] = hashedPassword.split(':');
      
      if (!saltHex || !hashHex) {
        throw new Error('Invalid hash format');
      }
      
      const salt = hexToArrayBuffer(saltHex);
      const passwordBuffer = stringToArrayBuffer(password);
      
      // Import password as key material
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        'PBKDF2',
        false,
        ['deriveBits']
      );
      
      // Derive key using same parameters
      const derivedKey = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: ITERATIONS,
          hash: 'SHA-256'
        },
        keyMaterial,
        256 // 32 bytes
      );
      
      const newHashHex = arrayBufferToHex(derivedKey);
      
      // Constant-time comparison
      return newHashHex === hashHex;
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw new Error('Failed to compare passwords');
    }
  }
};
