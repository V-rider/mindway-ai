
// Password hashing utilities using Web Crypto API
export class PasswordUtils {
  private static encoder = new TextEncoder();
  private static decoder = new TextDecoder();

  // Generate a random salt
  private static generateSalt(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(16));
  }

  // Convert ArrayBuffer to hex string
  private static bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Convert hex string to ArrayBuffer
  private static hexToBuffer(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  }

  // Hash password with salt using PBKDF2
  public static async hashPassword(password: string): Promise<string> {
    const salt = this.generateSalt();
    const passwordBuffer = this.encoder.encode(password);
    
    // Import the password as a key
    const key = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    // Derive bits using PBKDF2
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000, // 100k iterations for security
        hash: 'SHA-256'
      },
      key,
      256 // 32 bytes
    );

    // Combine salt and hash
    const saltHex = this.bufferToHex(salt);
    const hashHex = this.bufferToHex(derivedBits);
    
    return `${saltHex}:${hashHex}`;
  }

  // Verify password against stored hash
  public static async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    try {
      const [saltHex, hashHex] = storedHash.split(':');
      if (!saltHex || !hashHex) return false;

      const salt = this.hexToBuffer(saltHex);
      const passwordBuffer = this.encoder.encode(password);
      
      // Import the password as a key
      const key = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      );

      // Derive bits using the same parameters
      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        key,
        256
      );

      const computedHashHex = this.bufferToHex(derivedBits);
      return computedHashHex === hashHex;
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  // Check if a string looks like a hashed password (contains salt:hash format)
  public static isHashedPassword(password: string): boolean {
    return password.includes(':') && password.length > 32;
  }
}
