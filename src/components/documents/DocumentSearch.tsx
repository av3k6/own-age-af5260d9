
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClear?: () => void;
}

const DocumentSearch = ({ 
  searchTerm, 
  onSearchChange,
  onClear
}: DocumentSearchProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search documents..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8 pr-8"
      />
      {searchTerm && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" 
          onClick={() => {
            onSearchChange('');
            onClear?.();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default DocumentSearch;
