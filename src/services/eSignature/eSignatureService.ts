// This service will handle interactions with the e-signature API
// We're using a modular approach that allows us to swap providers if needed

import { DocumentMetadata } from '@/types/document';
import { supabase } from '@/lib/supabase';

// These enums help us keep track of signature status and provider types
export enum SignatureStatus {
  PENDING = 'pending',
  SIGNED = 'signed',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  COMPLETED = 'completed',
}

export enum SignatureProvider {
  HELLOSIGN = 'hellosign', // Dropbox HelloSign
  DOCUSIGN = 'docusign',   // DocuSign
  ADOBE_SIGN = 'adobe',    // Adobe Sign
  MANUAL = 'manual',       // Manual signature fallback
}

// Interface for signature requests
export interface SignatureRequest {
  id?: string;
  documentId: string;
  title: string;
  message?: string;
  signers: SignatureSigner[];
  status: SignatureStatus;
  provider: SignatureProvider;
  createdBy: string;
  createdAt?: string;
  completedAt?: string;
  expiresAt?: string;
}

// Interface for signers
export interface SignatureSigner {
  id?: string;
  name: string;
  email: string;
  role?: string;
  order?: number;
  status: SignatureStatus;
  signedAt?: string;
}

// Base e-signature provider interface
export interface ESignatureProvider {
  createSignatureRequest(document: DocumentMetadata, signers: SignatureSigner[], options?: any): Promise<SignatureRequest>;
  getSignatureStatus(requestId: string): Promise<SignatureStatus>;
  cancelSignatureRequest(requestId: string): Promise<boolean>;
  downloadSignedDocument(requestId: string): Promise<Blob>;
}

// E-signature service factory to get the appropriate provider
export const getESignatureProvider = (provider: SignatureProvider): ESignatureProvider => {
  // For now, we'll implement a basic provider that simulates signature functionality
  // Later, we can implement actual API integrations with real providers
  return new BasicSignatureProvider();
};

// Basic provider for initial implementation (can be replaced with actual API integration)
class BasicSignatureProvider implements ESignatureProvider {
  async createSignatureRequest(document: DocumentMetadata, signers: SignatureSigner[], options: any = {}): Promise<SignatureRequest> {
    const now = new Date().toISOString();
    
    // Store the signature request in the database
    const { data, error } = await supabase
      .from('signature_requests')
      .insert({
        document_id: document.id,
        title: options.title || document.name,
        message: options.message,
        status: SignatureStatus.PENDING,
        provider: SignatureProvider.MANUAL, // Default to manual for now
        created_by: options.createdBy,
        created_at: now,
        expires_at: options.expiresAt,
      })
      .select()
      .single();
      
    if (error) throw new Error(`Failed to create signature request: ${error.message}`);
    
    // Store the signers
    for (const signer of signers) {
      await supabase
        .from('signature_signers')
        .insert({
          request_id: data.id,
          name: signer.name,
          email: signer.email,
          role: signer.role,
          order: signer.order || 0,
          status: SignatureStatus.PENDING,
        });
    }
    
    // For now, we'll simulate sending emails by logging them
    console.log(`Signature request created for document: ${document.name}`);
    console.log(`Emails would be sent to: ${signers.map(s => s.email).join(', ')}`);
    
    return {
      id: data.id,
      documentId: document.id,
      title: options.title || document.name,
      message: options.message,
      signers,
      status: SignatureStatus.PENDING,
      provider: SignatureProvider.MANUAL,
      createdBy: options.createdBy,
      createdAt: now,
      expiresAt: options.expiresAt,
    };
  }
  
  async getSignatureStatus(requestId: string): Promise<SignatureStatus> {
    const { data, error } = await supabase
      .from('signature_requests')
      .select('status')
      .eq('id', requestId)
      .single();
      
    if (error) throw new Error(`Failed to get signature status: ${error.message}`);
    return data.status as SignatureStatus;
  }
  
  async cancelSignatureRequest(requestId: string): Promise<boolean> {
    const { error } = await supabase
      .from('signature_requests')
      .update({ status: SignatureStatus.DECLINED })
      .eq('id', requestId);
      
    if (error) throw new Error(`Failed to cancel signature request: ${error.message}`);
    return true;
  }
  
  async downloadSignedDocument(requestId: string): Promise<Blob> {
    // In a real implementation, this would return the signed document
    // For now, we'll just throw an error
    throw new Error('Not implemented - manual signatures require manual download');
  }
}

// Hook to manage e-signature operations
export const useSignatureService = () => {
  const createSignatureRequest = async (
    document: DocumentMetadata, 
    signers: SignatureSigner[], 
    options: { 
      provider?: SignatureProvider,
      title?: string,
      message?: string,
      createdBy: string,
      expiresAt?: string
    }
  ) => {
    const provider = getESignatureProvider(options.provider || SignatureProvider.MANUAL);
    return await provider.createSignatureRequest(document, signers, options);
  };
  
  const getSignatureStatus = async (requestId: string, provider: SignatureProvider) => {
    const providerService = getESignatureProvider(provider);
    return await providerService.getSignatureStatus(requestId);
  };
  
  const cancelSignatureRequest = async (requestId: string, provider: SignatureProvider) => {
    const providerService = getESignatureProvider(provider);
    return await providerService.cancelSignatureRequest(requestId);
  };
  
  const getSignatureRequests = async (userId: string) => {
    const { data, error } = await supabase
      .from('signature_requests')
      .select(`
        *,
        signers:signature_signers(*)
      `)
      .eq('created_by', userId);
      
    if (error) throw new Error(`Failed to get signature requests: ${error.message}`);
    return data;
  };
  
  return {
    createSignatureRequest,
    getSignatureStatus,
    cancelSignatureRequest,
    getSignatureRequests,
  };
};
