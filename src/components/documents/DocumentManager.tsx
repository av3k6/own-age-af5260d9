
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DocumentUploader from './DocumentUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import DocumentList from './DocumentList';
import DocumentSearch from './DocumentSearch';
import DocumentCategories from './DocumentCategories';
import DocumentFilters from './DocumentFilters';
import { useDocumentManagement } from '@/hooks/documents/useDocumentManagement';
import SignatureRequests from './signatures/SignatureRequests';

const DocumentManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    documents, 
    isLoading, 
    searchTerm, 
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    categories,
    handleDownload,
    handleDelete,
    sortBy,
    setSortBy,
    fileTypes,
    selectedFileTypes,
    setSelectedFileTypes,
    resetFilters
  } = useDocumentManagement(user?.id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
          <CardDescription>
            Upload, organize, and manage your property-related documents securely.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload Documents</TabsTrigger>
              <TabsTrigger value="manage">Manage Documents</TabsTrigger>
              <TabsTrigger value="signatures">E-Signatures</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="pt-4">
              <DocumentUploader 
                onUploadsComplete={() => {
                  toast({
                    title: "Documents uploaded",
                    description: "Your documents have been uploaded successfully."
                  });
                  // Refresh documents list will happen through the hook's useEffect
                }}
                maxFiles={10}
                maxSizeMB={10}
                folder="documents"
              />
            </TabsContent>
            <TabsContent value="manage" className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-col sm:flex-row">
                  <DocumentSearch 
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onClear={() => setSearchTerm('')}
                  />
                  <DocumentFilters
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    fileTypes={fileTypes}
                    selectedFileTypes={selectedFileTypes}
                    onFileTypeChange={setSelectedFileTypes}
                    onFilterReset={resetFilters}
                  />
                </div>
                
                <DocumentCategories 
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />
                
                <DocumentList 
                  documents={documents}
                  isLoading={isLoading}
                  searchTerm={searchTerm}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                />
              </div>
            </TabsContent>
            <TabsContent value="signatures" className="pt-4">
              <SignatureRequests />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentManager;
