
export interface Offer {
  id: string;
  propertyId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  contingencies: string[];
  deadline: Date;
  status: 'pending' | 'accepted' | 'countered' | 'rejected' | 'withdrawn';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}
