
import { EncryptionKeyPair } from "@/types/encryption";
import encryptionService from "./encryptionService";
import { useSupabase } from "@/hooks/useSupabase";

/**
 * Key Management Service
 * 
 * Handles storage and retrieval of encryption keys, as well as
 * key exchange between users for end-to-end encrypted messaging.
 */
export class KeyManagementService {
  private static instance: KeyManagementService;
  private readonly STORAGE_KEY = "transaczen_encryption_keys";
  private initialized = false;
  private supabase: ReturnType<typeof useSupabase>["supabase"];

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): KeyManagementService {
    if (!KeyManagementService.instance) {
      KeyManagementService.instance = new KeyManagementService();
    }
    return KeyManagementService.instance;
  }

  /**
   * Initialize the key management service
   */
  public async initialize(supabase: ReturnType<typeof useSupabase>["supabase"], userId: string): Promise<EncryptionKeyPair> {
    if (this.initialized) {
      return encryptionService.getKeyPair();
    }
    
    this.supabase = supabase;
    
    // Try to load keys from local storage first
    const storedKeyPair = this.loadKeysFromStorage(userId);
    let keyPair: EncryptionKeyPair;
    
    if (storedKeyPair) {
      // Initialize encryption service with existing keys
      keyPair = await encryptionService.initialize(storedKeyPair);
    } else {
      // Generate new keys
      keyPair = await encryptionService.initialize();
      
      // Save to storage
      this.saveKeysToStorage(userId, keyPair);
      
      // Register public key with the server
      await this.registerPublicKey(userId, keyPair.publicKey);
    }
    
    this.initialized = true;
    return keyPair;
  }

  /**
   * Save keys to local storage
   */
  private saveKeysToStorage(userId: string, keyPair: EncryptionKeyPair): void {
    try {
      const existingData = localStorage.getItem(this.STORAGE_KEY);
      const keyData = existingData ? JSON.parse(existingData) : {};
      
      // Store keys indexed by user ID
      keyData[userId] = keyPair;
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(keyData));
    } catch (error) {
      console.error("Failed to save encryption keys to storage:", error);
      throw new Error("Failed to save encryption keys");
    }
  }

  /**
   * Load keys from local storage
   */
  private loadKeysFromStorage(userId: string): EncryptionKeyPair | null {
    try {
      const existingData = localStorage.getItem(this.STORAGE_KEY);
      if (!existingData) return null;
      
      const keyData = JSON.parse(existingData);
      return keyData[userId] || null;
    } catch (error) {
      console.error("Failed to load encryption keys from storage:", error);
      return null;
    }
  }

  /**
   * Register the user's public key with the server
   */
  private async registerPublicKey(userId: string, publicKey: string): Promise<void> {
    try {
      // Store the public key in Supabase for key exchange
      const { error } = await this.supabase
        .from('user_encryption_keys')
        .upsert({
          user_id: userId,
          public_key: publicKey,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (error) {
        console.error("Failed to register public key:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error registering public key:", error);
      // Continue anyway - we'll use local encryption even if server registration fails
    }
  }

  /**
   * Fetch a user's public key from the server
   */
  public async getPublicKey(userId: string): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from('user_encryption_keys')
        .select('public_key')
        .eq('user_id', userId)
        .single();
        
      if (error || !data) {
        console.error("Failed to fetch public key:", error);
        throw new Error("Failed to fetch recipient's public key");
      }
      
      return data.public_key;
    } catch (error) {
      console.error("Error fetching public key:", error);
      throw new Error("Failed to fetch recipient's public key");
    }
  }

  /**
   * Get the current user's public key
   */
  public getCurrentUserPublicKey(): string {
    if (!this.initialized) {
      throw new Error("Key management service not initialized");
    }
    
    return encryptionService.getPublicKey();
  }

  /**
   * Encrypt a message for a recipient
   */
  public async encryptMessage(message: string, recipientId: string): Promise<string> {
    const recipientPublicKey = await this.getPublicKey(recipientId);
    const encryptedContent = await encryptionService.encryptMessage(message, recipientPublicKey);
    return JSON.stringify(encryptedContent);
  }

  /**
   * Decrypt a message
   */
  public async decryptMessage(encryptedMessage: string): Promise<string> {
    const encryptedContent = JSON.parse(encryptedMessage);
    return await encryptionService.decryptMessage(encryptedContent);
  }
}

export default KeyManagementService.getInstance();
