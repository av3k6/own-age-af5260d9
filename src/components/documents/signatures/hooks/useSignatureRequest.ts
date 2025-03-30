
import { useSignatureService, SignatureSigner, SignatureStatus } from '@/services/eSignature/eSignatureService';
import { DocumentMetadata } from '@/types/document';
import { SignatureFormData, SignerType } from '../types/signatureTypes';

export function useSignatureRequest() {
  const { createSignatureRequest: createRequest } = useSignatureService();

  const createSignatureRequest = async (
    document: DocumentMetadata,
    formData: SignatureFormData,
    userId: string
  ) => {
    // Convert to proper signer format
    const signatureSigners: SignatureSigner[] = formData.signers.map((s, index) => ({
      name: s.name.trim(),
      email: s.email.trim(),
      order: index + 1,
      status: SignatureStatus.PENDING
    }));
    
    // Create signature request
    return await createRequest(document, signatureSigners, {
      title: formData.title,
      message: formData.message,
      createdBy: userId,
      expiresAt: formData.expirationDate?.toISOString(),
    });
  };

  return {
    createSignatureRequest
  };
}
