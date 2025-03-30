
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface SignatureFormFieldsProps {
  title: string;
  message: string;
  onTitleChange: (title: string) => void;
  onMessageChange: (message: string) => void;
}

const SignatureFormFields: React.FC<SignatureFormFieldsProps> = ({
  title,
  message,
  onTitleChange,
  onMessageChange,
}) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Signature request title"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Add a message to the signers"
          rows={2}
        />
      </div>
    </>
  );
};

export default SignatureFormFields;
