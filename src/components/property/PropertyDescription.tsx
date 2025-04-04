
import { PropertyListing } from '@/types';

interface PropertyDescriptionProps {
  property: PropertyListing;
}

export default function PropertyDescription({ property }: PropertyDescriptionProps) {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-zen-gray-800 mb-4">Description</h2>
      <p className="text-zen-gray-600 whitespace-pre-line">
        {property.description}
      </p>
    </div>
  );
}
