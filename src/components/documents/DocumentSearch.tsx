
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DocumentSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const DocumentSearch = ({ 
  searchTerm, 
  onSearchChange 
}: DocumentSearchProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search documents..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default DocumentSearch;
