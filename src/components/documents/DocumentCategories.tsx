
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderOpen } from "lucide-react";

interface DocumentCategoriesProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const DocumentCategories = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: DocumentCategoriesProps) => {
  return (
    <Tabs 
      defaultValue="all" 
      value={activeCategory}
      onValueChange={onCategoryChange}
      className="w-full"
    >
      <TabsList className="mb-4 flex flex-wrap gap-2">
        <TabsTrigger value="all" className="flex items-center gap-1">
          <FolderOpen className="h-4 w-4" />
          <span>All</span>
        </TabsTrigger>
        
        {categories
          .filter(cat => cat !== 'all')
          .map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="flex items-center gap-1"
            >
              <FolderOpen className="h-4 w-4" />
              <span className="capitalize">{category}</span>
            </TabsTrigger>
          ))
        }
      </TabsList>
    </Tabs>
  );
};

export default DocumentCategories;
