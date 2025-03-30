
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { SignerType } from './types/signatureTypes';

interface SignersListProps {
  signers: SignerType[];
  onAddSigner: () => void;
  onRemoveSigner: (index: number) => void;
  onSignerChange: (index: number, field: keyof SignerType, value: string) => void;
}

const SignersList: React.FC<SignersListProps> = ({
  signers,
  onAddSigner,
  onRemoveSigner,
  onSignerChange,
}) => {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Signers</label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={onAddSigner}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Signer
        </Button>
      </div>
      
      <div className="space-y-2">
        {signers.map((signer, index) => (
          <div key={index} className="flex gap-2 items-start">
            <Input
              placeholder="Name"
              value={signer.name}
              onChange={(e) => onSignerChange(index, 'name', e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Email"
              type="email"
              value={signer.email}
              onChange={(e) => onSignerChange(index, 'email', e.target.value)}
              className="flex-1"
            />
            {signers.length > 1 && (
              <Button 
                type="button"
                variant="ghost" 
                size="icon"
                onClick={() => onRemoveSigner(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignersList;
