
import { SignatureStatus, SignatureSigner } from '@/services/eSignature/eSignatureService';

// Define a concrete type for signers
export type SignerType = {
  name: string;
  email: string;
};

export interface SignatureFormData {
  title: string;
  message: string;
  signers: SignerType[];
  expirationDate?: Date;
}
