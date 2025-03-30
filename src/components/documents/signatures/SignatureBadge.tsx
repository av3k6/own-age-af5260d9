
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SignatureStatus } from '@/services/eSignature/eSignatureService';

interface SignatureBadgeProps {
  status: SignatureStatus;
}

const SignatureBadge: React.FC<SignatureBadgeProps> = ({ status }) => {
  switch (status) {
    case SignatureStatus.PENDING:
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    case SignatureStatus.SIGNED:
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Signed</Badge>;
    case SignatureStatus.COMPLETED:
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
    case SignatureStatus.DECLINED:
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
    case SignatureStatus.EXPIRED:
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Expired</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default SignatureBadge;
