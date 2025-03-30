
import { PropertyListing, Showing } from "@/types";

export interface ShowingWithProperty extends Showing {
  property?: PropertyListing;
  sellerName?: string;
  buyerName?: string;
}

export interface ShowingRequestManagerProps {
  isBuyer?: boolean;
}
