
import React from 'react';
import { Mail } from 'lucide-react';

const EmptySignatureState: React.FC = () => {
  return (
    <div className="text-center p-8 border rounded-lg bg-muted/30">
      <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium mb-1">No signature requests</h3>
      <p className="text-muted-foreground">
        You haven't sent any document signature requests yet.
      </p>
    </div>
  );
};

export default EmptySignatureState;
