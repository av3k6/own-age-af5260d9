
import { EncryptionKeyPair, EncryptedContent } from "@/types/encryption";

/**
 * Encryption Service - Handles end-to-end encryption for messages
 * 
 * This implementation uses the Web Crypto API for secure cryptographic operations.
 * The general approach is:
 * 1. Generate key pairs for users
 * 2. For each message:
 *    - Generate a one-time symmetric key
 *    - Encrypt the message with this symmetric key
 *    - Encrypt the symmetric key with the recipient's public key
 *    - Send both the encrypted message and encrypted key
 * 3. Recipients decrypt using their private key
 */
export class EncryptionService {
  private static instance: EncryptionService;
  private keyPair: CryptoKeyPair | null = null;
  private exportedPublicKey: string | null = null;
  private exportedPrivateKey: string | null = null;

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * Initialize the encryption service for a user
   * @param storedKeyPair Optional stored key pair from local storage
   */
  public async initialize(storedKeyPair?: EncryptionKeyPair): Promise<EncryptionKeyPair> {
    try {
      if (storedKeyPair) {
        // Import stored key pair
        await this.importKeyPair(storedKeyPair);
        return storedKeyPair;
      } else {
        // Generate new key pair
        return await this.generateAndExportKeyPair();
      }
    } catch (error) {
      console.error("Failed to initialize encryption service:", error);
      throw new Error("Encryption initialization failed");
    }
  }

  /**
   * Generate a new RSA key pair for asymmetric encryption
   */
  private async generateKeyPair(): Promise<CryptoKeyPair> {
    try {
      this.keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
          hash: "SHA-256"
        },
        true, // extractable
        ["encrypt", "decrypt"]
      );
      return this.keyPair;
    } catch (error) {
      console.error("Failed to generate key pair:", error);
      throw error;
    }
  }

  /**
   * Generate a new key pair and export it for storage
   */
  private async generateAndExportKeyPair(): Promise<EncryptionKeyPair> {
    const keyPair = await this.generateKeyPair();
    
    // Export the public key
    const exportedPublicKey = await window.crypto.subtle.exportKey(
      "spki",
      keyPair.publicKey
    );
    this.exportedPublicKey = this.arrayBufferToBase64(exportedPublicKey);
    
    // Export the private key
    const exportedPrivateKey = await window.crypto.subtle.exportKey(
      "pkcs8",
      keyPair.privateKey
    );
    this.exportedPrivateKey = this.arrayBufferToBase64(exportedPrivateKey);
    
    return {
      publicKey: this.exportedPublicKey,
      privateKey: this.exportedPrivateKey
    };
  }

  /**
   * Import a key pair from storage
   */
  private async importKeyPair(keyPair: EncryptionKeyPair): Promise<void> {
    try {
      const publicKeyBuffer = this.base64ToArrayBuffer(keyPair.publicKey);
      const privateKeyBuffer = this.base64ToArrayBuffer(keyPair.privateKey);
      
      // Import the public key
      const publicKey = await window.crypto.subtle.importKey(
        "spki",
        publicKeyBuffer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256"
        },
        true,
        ["encrypt"]
      );
      
      // Import the private key
      const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        privateKeyBuffer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256"
        },
        true,
        ["decrypt"]
      );
      
      this.keyPair = { publicKey, privateKey };
      this.exportedPublicKey = keyPair.publicKey;
      this.exportedPrivateKey = keyPair.privateKey;
    } catch (error) {
      console.error("Failed to import key pair:", error);
      throw error;
    }
  }

  /**
   * Encrypt a message for a recipient
   * @param message The message to encrypt
   * @param recipientPublicKey The recipient's public key
   */
  public async encryptMessage(message: string, recipientPublicKey: string): Promise<EncryptedContent> {
    try {
      // Generate a one-time symmetric key for this message
      const symmetricKey = await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256
        },
        true,
        ["encrypt", "decrypt"]
      );
      
      // Generate a random IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt the message with the symmetric key
      const messageBuffer = new TextEncoder().encode(message);
      const encryptedMessage = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv
        },
        symmetricKey,
        messageBuffer
      );
      
      // Export the symmetric key
      const exportedSymmetricKey = await window.crypto.subtle.exportKey(
        "raw",
        symmetricKey
      );
      
      // Import the recipient's public key
      const recipientPublicKeyBuffer = this.base64ToArrayBuffer(recipientPublicKey);
      const importedRecipientPublicKey = await window.crypto.subtle.importKey(
        "spki",
        recipientPublicKeyBuffer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256"
        },
        false,
        ["encrypt"]
      );
      
      // Encrypt the symmetric key with the recipient's public key
      const encryptedSymmetricKey = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP"
        },
        importedRecipientPublicKey,
        exportedSymmetricKey
      );
      
      return {
        iv: this.arrayBufferToBase64(iv),
        data: this.arrayBufferToBase64(encryptedMessage),
        encryptedKey: this.arrayBufferToBase64(encryptedSymmetricKey)
      };
    } catch (error) {
      console.error("Failed to encrypt message:", error);
      throw new Error("Message encryption failed");
    }
  }

  /**
   * Decrypt a message using the user's private key
   * @param encryptedContent The encrypted content
   */
  public async decryptMessage(encryptedContent: EncryptedContent): Promise<string> {
    if (!this.keyPair) {
      throw new Error("Encryption service not initialized");
    }
    
    try {
      // Decrypt the symmetric key with the user's private key
      const encryptedKeyBuffer = this.base64ToArrayBuffer(encryptedContent.encryptedKey!);
      const symmetricKeyBuffer = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP"
        },
        this.keyPair.privateKey,
        encryptedKeyBuffer
      );
      
      // Import the symmetric key
      const symmetricKey = await window.crypto.subtle.importKey(
        "raw",
        symmetricKeyBuffer,
        {
          name: "AES-GCM",
          length: 256
        },
        false,
        ["decrypt"]
      );
      
      // Decrypt the message with the symmetric key
      const iv = this.base64ToArrayBuffer(encryptedContent.iv);
      const encryptedDataBuffer = this.base64ToArrayBuffer(encryptedContent.data);
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv
        },
        symmetricKey,
        encryptedDataBuffer
      );
      
      return new TextDecoder().decode(decryptedBuffer);
    } catch (error) {
      console.error("Failed to decrypt message:", error);
      throw new Error("Message decryption failed");
    }
  }

  /**
   * Get the user's public key
   */
  public getPublicKey(): string {
    if (!this.exportedPublicKey) {
      throw new Error("Encryption service not initialized");
    }
    return this.exportedPublicKey;
  }

  /**
   * Get the full key pair for storage
   */
  public getKeyPair(): EncryptionKeyPair {
    if (!this.exportedPublicKey || !this.exportedPrivateKey) {
      throw new Error("Encryption service not initialized");
    }
    return {
      publicKey: this.exportedPublicKey,
      privateKey: this.exportedPrivateKey
    };
  }

  /**
   * Helper: Convert ArrayBuffer to Base64 string
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Helper: Convert Base64 string to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

export default EncryptionService.getInstance();
