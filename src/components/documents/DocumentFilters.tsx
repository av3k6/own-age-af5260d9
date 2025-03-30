
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal, Check } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'size-asc' | 'size-desc';

interface DocumentFiltersProps {
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  onFilterReset: () => void;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  onDateRangeChange?: (range: { from?: Date; to?: Date }) => void;
  fileTypes: string[];
  selectedFileTypes: string[];
  onFileTypeChange: (fileTypes: string[]) => void;
}

const DocumentFilters = ({
  sortBy,
  onSortChange,
  onFilterReset,
  fileTypes,
  selectedFileTypes,
  onFileTypeChange
}: DocumentFiltersProps) => {
  const handleFileTypeToggle = (fileType: string) => {
    if (selectedFileTypes.includes(fileType)) {
      onFileTypeChange(selectedFileTypes.filter(type => type !== fileType));
    } else {
      onFileTypeChange([...selectedFileTypes, fileType]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort documents" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Name A-Z</SelectItem>
          <SelectItem value="name-desc">Name Z-A</SelectItem>
          <SelectItem value="date-desc">Newest first</SelectItem>
          <SelectItem value="date-asc">Oldest first</SelectItem>
          <SelectItem value="size-desc">Largest first</SelectItem>
          <SelectItem value="size-asc">Smallest first</SelectItem>
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" title="Filter options">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filter by file type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {fileTypes.map(fileType => (
              <DropdownMenuItem key={fileType} onClick={() => handleFileTypeToggle(fileType)}>
                <div className="flex items-center w-full">
                  <span className="flex-1">{fileType.toUpperCase()}</span>
                  {selectedFileTypes.includes(fileType) && <Check className="h-4 w-4" />}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onFilterReset}>
            Reset all filters
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DocumentFilters;
