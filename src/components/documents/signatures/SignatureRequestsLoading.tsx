
import React from 'react';
import { Loader2 } from 'lucide-react';

const SignatureRequestsLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default SignatureRequestsLoading;
