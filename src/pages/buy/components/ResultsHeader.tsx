
import { useState } from "react";
import { Label } from "@/components/ui/label";

interface ResultsHeaderProps {
  count: number;
}

const ResultsHeader = ({ count }: ResultsHeaderProps) => {
  // This state would handle sorting in a real implementation
  const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-zen-gray-800">
        {count} Properties Found
      </h2>
      
      <div className="flex items-center space-x-2">
        <Label htmlFor="sort" className="text-sm font-medium text-zen-gray-700">
          Sort by:
        </Label>
        <select
          id="sort"
          className="border rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-zen-blue-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="beds-desc">Most Bedrooms</option>
          <option value="baths-desc">Most Bathrooms</option>
        </select>
      </div>
    </div>
  );
};

export default ResultsHeader;
