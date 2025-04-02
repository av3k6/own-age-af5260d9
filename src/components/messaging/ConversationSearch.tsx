
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConversationCategory } from "@/types/encryption";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ConversationSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory?: ConversationCategory;
  onCategoryChange: (category?: ConversationCategory) => void;
  hasUnread?: boolean;
  onUnreadChange: (hasUnread?: boolean) => void;
  onClearFilters: () => void;
}

const ConversationSearch: React.FC<ConversationSearchProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  hasUnread,
  onUnreadChange,
  onClearFilters,
}) => {
  return (
    <div className="p-3 border-b bg-muted/20">
      <div className="relative mb-2">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 w-full"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Select
          value={selectedCategory}
          onValueChange={(value) => onCategoryChange(value as ConversationCategory || undefined)}
        >
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value={ConversationCategory.PROPERTY}>Property</SelectItem>
            <SelectItem value={ConversationCategory.OFFER}>Offer</SelectItem>
            <SelectItem value={ConversationCategory.DOCUMENT}>Document</SelectItem>
            <SelectItem value={ConversationCategory.GENERAL}>General</SelectItem>
            <SelectItem value={ConversationCategory.SUPPORT}>Support</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={hasUnread ? "unread" : "all"}
          onValueChange={(value) => onUnreadChange(value === "unread" ? true : undefined)}
        >
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="Read Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messages</SelectItem>
            <SelectItem value="unread">Unread Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {(searchTerm || selectedCategory || hasUnread) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="w-full mt-2 text-xs"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default ConversationSearch;
