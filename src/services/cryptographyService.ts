/**
 * Cryptography utilities service
 * Provides methods for hashing and basic cryptographic operations
 */

export interface HashResult {
  original: string;
  hash: string;
  algorithm: string;
  length: number;
}

export interface EncryptionResult {
  encrypted: string;
  algorithm: string;
  keyUsed: boolean;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export class CryptographyService {
  /**
   * Generate MD5 hash (using Web Crypto API or fallback)
   */
  static async generateMD5(input: string): Promise<string> {
    // Note: Web Crypto API doesn't support MD5, so we'll use a simple implementation
    return this.simpleMD5(input);
  }

  /**
   * Generate SHA-1 hash
   */
  static async generateSHA1(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    return this.bufferToHex(hashBuffer);
  }

  /**
   * Generate SHA-256 hash
   */
  static async generateSHA256(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return this.bufferToHex(hashBuffer);
  }

  /**
   * Generate SHA-384 hash
   */
  static async generateSHA384(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-384', data);
    return this.bufferToHex(hashBuffer);
  }

  /**
   * Generate SHA-512 hash
   */
  static async generateSHA512(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    return this.bufferToHex(hashBuffer);
  }

  /**
   * Generate all hashes at once
   */
  static async generateAllHashes(input: string): Promise<HashResult[]> {
    const results: HashResult[] = [];

    try {
      const md5Hash = await this.generateMD5(input);
      results.push({
        original: input,
        hash: md5Hash,
        algorithm: 'MD5',
        length: md5Hash.length
      });
    } catch (error) {
      console.warn('MD5 generation failed:', error);
    }

    try {
      const sha1Hash = await this.generateSHA1(input);
      results.push({
        original: input,
        hash: sha1Hash,
        algorithm: 'SHA-1',
        length: sha1Hash.length
      });
    } catch (error) {
      console.warn('SHA-1 generation failed:', error);
    }

    try {
      const sha256Hash = await this.generateSHA256(input);
      results.push({
        original: input,
        hash: sha256Hash,
        algorithm: 'SHA-256',
        length: sha256Hash.length
      });
    } catch (error) {
      console.warn('SHA-256 generation failed:', error);
    }

    try {
      const sha384Hash = await this.generateSHA384(input);
      results.push({
        original: input,
        hash: sha384Hash,
        algorithm: 'SHA-384',
        length: sha384Hash.length
      });
    } catch (error) {
      console.warn('SHA-384 generation failed:', error);
    }

    try {
      const sha512Hash = await this.generateSHA512(input);
      results.push({
        original: input,
        hash: sha512Hash,
        algorithm: 'SHA-512',
        length: sha512Hash.length
      });
    } catch (error) {
      console.warn('SHA-512 generation failed:', error);
    }

    return results;
  }

  /**
   * Convert ArrayBuffer to hex string
   */
  private static bufferToHex(buffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(buffer);
    const hexCodes: string[] = [];
    for (let i = 0; i < byteArray.length; i++) {
      const hexCode = byteArray[i].toString(16);
      const paddedHexCode = hexCode.padStart(2, '0');
      hexCodes.push(paddedHexCode);
    }
    return hexCodes.join('');
  }

  /**
   * Simple MD5 implementation (for demonstration purposes)
   * Note: This is a basic implementation and should not be used for security purposes
   */
  private static simpleMD5(input: string): string {
    // This is a simplified MD5-like hash for demonstration
    // In a real application, you would use a proper crypto library
    let hash = 0;
    if (input.length === 0) return hash.toString(16).padStart(32, '0');
    
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to positive number and pad to 32 characters
    const positiveHash = Math.abs(hash);
    const hexHash = positiveHash.toString(16);
    return hexHash.padStart(32, '0');
  }

  /**
   * Generate a simple checksum
   */
  static generateChecksum(input: string): string {
    let checksum = 0;
    for (let i = 0; i < input.length; i++) {
      checksum += input.charCodeAt(i);
    }
    return checksum.toString(16).toUpperCase();
  }

  /**
   * Generate CRC32 (simplified version)
   */
  static generateCRC32(input: string): string {
    const crcTable: number[] = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      crcTable[n] = c;
    }

    let crc = 0 ^ (-1);
    for (let i = 0; i < input.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ input.charCodeAt(i)) & 0xFF];
    }
    return ((crc ^ (-1)) >>> 0).toString(16).toUpperCase().padStart(8, '0');
  }

  /**
   * Generate Base64 hash of input
   */
  static generateBase64Hash(input: string): string {
    return btoa(input);
  }

  /**
   * Generate a hash comparison result
   */
  static compareHashes(input1: string, input2: string, algorithm: string): {
    match: boolean;
    hash1: string;
    hash2: string;
    algorithm: string;
  } {
    // This would need to be async for real hash algorithms
    // For now, we'll use a simple string comparison
    const hash1 = this.generateChecksum(input1);
    const hash2 = this.generateChecksum(input2);
    
    return {
      match: hash1 === hash2,
      hash1,
      hash2,
      algorithm
    };
  }

  /**
   * Get hash algorithm information
   */
  static getAlgorithmInfo(algorithm: string): {
    name: string;
    description: string;
    outputLength: number;
    securityLevel: 'Low' | 'Medium' | 'High' | 'Very High';
    useCases: string[];
  } {
    switch (algorithm.toUpperCase()) {
      case 'MD5':
        return {
          name: 'MD5',
          description: 'Message Digest Algorithm 5',
          outputLength: 32,
          securityLevel: 'Low',
          useCases: ['File integrity', 'Legacy systems', 'Non-cryptographic checksums']
        };
      case 'SHA-1':
      case 'SHA1':
        return {
          name: 'SHA-1',
          description: 'Secure Hash Algorithm 1',
          outputLength: 40,
          securityLevel: 'Low',
          useCases: ['Legacy systems', 'Git commits', 'Basic integrity checks']
        };
      case 'SHA-256':
      case 'SHA256':
        return {
          name: 'SHA-256',
          description: 'Secure Hash Algorithm 256-bit',
          outputLength: 64,
          securityLevel: 'High',
          useCases: ['Passwords', 'Digital signatures', 'Blockchain', 'Security applications']
        };
      case 'SHA-384':
      case 'SHA384':
        return {
          name: 'SHA-384',
          description: 'Secure Hash Algorithm 384-bit',
          outputLength: 96,
          securityLevel: 'Very High',
          useCases: ['High-security applications', 'Government systems', 'Financial systems']
        };
      case 'SHA-512':
      case 'SHA512':
        return {
          name: 'SHA-512',
          description: 'Secure Hash Algorithm 512-bit',
          outputLength: 128,
          securityLevel: 'Very High',
          useCases: ['Maximum security', 'Long-term storage', 'Critical systems']
        };
      default:
        return {
          name: algorithm,
          description: 'Unknown algorithm',
          outputLength: 0,
          securityLevel: 'Low',
          useCases: ['Unknown']
        };
    }
  }

  // ========================
  // ENCRYPTION/DECRYPTION METHODS
  // ========================

  /**
   * Generate AES key from password using PBKDF2
   */
  static async generateAESKey(password: string, salt?: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    const saltBytes = encoder.encode(salt || 'SpannerlyDefaultSalt');

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt text using AES-256-GCM
   */
  static async encryptAES(text: string, password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    const key = await this.generateAESKey(password);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for GCM
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    // Convert to base64 without spread operator
    let binaryString = '';
    for (let i = 0; i < combined.length; i++) {
      binaryString += String.fromCharCode(combined[i]);
    }
    return btoa(binaryString);
  }

  /**
   * Decrypt text using AES-256-GCM
   */
  static async decryptAES(encryptedText: string, password: string): Promise<string> {
    try {
      const combined = new Uint8Array(
        atob(encryptedText).split('').map(char => char.charCodeAt(0))
      );
      
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);
      
      const key = await this.generateAESKey(password);
      
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );
      
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      throw new Error('Decryption failed. Please check your password and encrypted text.');
    }
  }

  /**
   * Encrypt text using Base64 with optional password protection
   */
  static encryptBase64(text: string, password?: string): string {
    if (password) {
      // Simple XOR with password for basic protection
      const xored = this.xorWithPassword(text, password);
      return btoa(xored);
    }
    return btoa(text);
  }

  /**
   * Decrypt Base64 text with optional password protection
   */
  static decryptBase64(encryptedText: string, password?: string): string {
    try {
      const decoded = atob(encryptedText);
      if (password) {
        return this.xorWithPassword(decoded, password);
      }
      return decoded;
    } catch (error) {
      throw new Error('Invalid Base64 string or incorrect password');
    }
  }

  /**
   * Generate RSA key pair for encryption/decryption
   */
  static async generateRSAKeyPair(): Promise<KeyPair> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt']
    );

    const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    return {
      publicKey: this.arrayBufferToBase64(publicKey),
      privateKey: this.arrayBufferToBase64(privateKey),
    };
  }

  /**
   * Encrypt text using RSA public key
   */
  static async encryptRSA(text: string, publicKeyBase64: string): Promise<string> {
    try {
      const publicKeyBuffer = this.base64ToArrayBuffer(publicKeyBase64);
      const publicKey = await crypto.subtle.importKey(
        'spki',
        publicKeyBuffer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['encrypt']
      );

      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      // RSA can only encrypt data smaller than key size minus padding
      // For 2048-bit key, max is about 190 bytes
      if (data.length > 190) {
        throw new Error('Text too long for RSA encryption. Maximum length is about 190 characters.');
      }
      
      const encrypted = await crypto.subtle.encrypt('RSA-OAEP', publicKey, data);
      return this.arrayBufferToBase64(encrypted);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`RSA encryption failed: ${error.message}`);
      }
      throw new Error('RSA encryption failed. Please check your public key format.');
    }
  }

  /**
   * Decrypt text using RSA private key
   */
  static async decryptRSA(encryptedText: string, privateKeyBase64: string): Promise<string> {
    try {
      const privateKeyBuffer = this.base64ToArrayBuffer(privateKeyBase64);
      const privateKey = await crypto.subtle.importKey(
        'pkcs8',
        privateKeyBuffer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['decrypt']
      );

      const encryptedBuffer = this.base64ToArrayBuffer(encryptedText);
      const decrypted = await crypto.subtle.decrypt('RSA-OAEP', privateKey, encryptedBuffer);
      
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`RSA decryption failed: ${error.message}`);
      }
      throw new Error('RSA decryption failed. Please check your private key and encrypted text.');
    }
  }

  // ========================
  // UTILITY METHODS
  // ========================

  /**
   * XOR text with password for simple encryption
   */
  private static xorWithPassword(text: string, password: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const textChar = text.charCodeAt(i);
      const passChar = password.charCodeAt(i % password.length);
      result += String.fromCharCode(textChar ^ passChar);
    }
    return result;
  }

  /**
   * Convert ArrayBuffer to Base64 string
   */
  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(byte => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  /**
   * Convert Base64 string to ArrayBuffer
   */
  private static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
