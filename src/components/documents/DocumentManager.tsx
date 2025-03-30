import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabase } from '@/hooks/useSupabase';
import DocumentUploader from './DocumentUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FolderOpen, Clock, Trash2, Download, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/hooks/use-toast';
import { DocumentMetadata } from '@/types/document';

const DocumentManager = () => {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentMetadata[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { toast } = useToast();

  useEffect(() => {
    const loadDocuments = async () => {
      if (!user) {
        setDocuments([]);
        setFilteredDocuments([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data: files, error } = await supabase.storage
          .from('storage')
          .list(`documents/${user.id}`, {
            sortBy: { column: 'name', order: 'asc' },
          });

        if (error) throw error;

        if (!files || files.length === 0) {
          setDocuments([]);
          setFilteredDocuments([]);
          setIsLoading(false);
          return;
        }

        const docsWithMetadata = await Promise.all(
          files.map(async (file) => {
            const filePath = `documents/${user.id}/${file.name}`;
            const { data: urlData } = supabase.storage
              .from('storage')
              .getPublicUrl(filePath);

            const { data: metaData } = await supabase
              .from('document_metadata')
              .select('*')
              .eq('path', filePath)
              .single();

            return {
              id: file.id,
              name: file.name,
              type: file.metadata?.mimetype || 'application/octet-stream',
              size: file.metadata?.size || 0,
              createdAt: file.created_at || new Date().toISOString(),
              url: urlData.publicUrl,
              path: filePath,
              category: metaData?.category || 'Uncategorized',
              description: metaData?.description || '',
            };
          })
        );

        setDocuments(docsWithMetadata);
        setFilteredDocuments(docsWithMetadata);
      } catch (error) {
        console.error('Error loading documents:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your documents. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [user, supabase, toast]);

  useEffect(() => {
    if (!documents.length) {
      setFilteredDocuments([]);
      return;
    }

    let filtered = documents;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(term) ||
          doc.description?.toLowerCase().includes(term) ||
          doc.category?.toLowerCase().includes(term)
      );
    }

    if (activeTab !== 'all') {
      filtered = filtered.filter((doc) => doc.category?.toLowerCase() === activeTab.toLowerCase());
    }

    setFilteredDocuments(filtered);
  }, [searchTerm, activeTab, documents]);

  const handleDownload = async (doc: DocumentMetadata) => {
    try {
      const { data, error } = await supabase.storage
        .from('storage')
        .download(doc.path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = doc.name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Document downloaded',
        description: `${doc.name} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download failed',
        description: 'Failed to download the document. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (doc: DocumentMetadata) => {
    if (!confirm(`Are you sure you want to delete ${doc.name}?`)) {
      return;
    }

    try {
      const { error: storageError } = await supabase.storage
        .from('storage')
        .remove([doc.path]);

      if (storageError) throw storageError;

      await supabase
        .from('document_metadata')
        .delete()
        .eq('path', doc.path);

      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      toast({
        title: 'Document deleted',
        description: `${doc.name} has been deleted successfully.`,
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete failed',
        description: 'Failed to delete the document. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return "bg-red-100 text-red-600";
      case 'doc':
      case 'docx':
        return "bg-blue-100 text-blue-600";
      case 'xls':
      case 'xlsx':
        return "bg-green-100 text-green-600";
      case 'jpg':
      case 'jpeg':
      case 'png':
        return "bg-purple-100 text-purple-600";
      case 'txt':
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };
  
  const uniqueCategories = ['all', ...new Set(documents.map(doc => doc.category?.toLowerCase() || 'uncategorized'))];

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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Documents</TabsTrigger>
              <TabsTrigger value="manage">Manage Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="pt-4">
              <DocumentUploader 
                onUploadsComplete={() => {
                  toast({
                    title: "Documents uploaded",
                    description: "Your documents have been uploaded successfully."
                  });
                  // Refresh documents list
                }}
                maxFiles={10}
                maxSizeMB={10}
                folder="documents"
              />
            </TabsContent>
            <TabsContent value="manage" className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <Tabs 
                  defaultValue="all" 
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="mb-4 flex flex-wrap gap-2">
                    <TabsTrigger value="all" className="flex items-center gap-1">
                      <FolderOpen className="h-4 w-4" />
                      <span>All</span>
                    </TabsTrigger>
                    
                    {uniqueCategories
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
                  
                  <TabsContent value={activeTab} className="mt-0">
                    {isLoading ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-4 p-3 border rounded-md">
                            <Skeleton className="h-12 w-12 rounded" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-1/3" />
                              <Skeleton className="h-3 w-1/4" />
                            </div>
                            <Skeleton className="h-9 w-20" />
                          </div>
                        ))}
                      </div>
                    ) : filteredDocuments.length > 0 ? (
                      <div className="space-y-2">
                        {filteredDocuments.map((document) => (
                          <div
                            key={document.id}
                            className="flex items-center p-3 border rounded-md hover:bg-muted/50 transition-colors"
                          >
                            <div className={`flex items-center justify-center h-12 w-12 rounded ${getFileIcon(document.name)}`}>
                              <span className="font-medium text-sm">{document.name.split('.').pop()?.toUpperCase()}</span>
                            </div>
                            
                            <div className="ml-4 flex-1 min-w-0">
                              <p className="font-medium truncate">{document.name}</p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="mr-1 h-3 w-3" />
                                <span>
                                  {new Date(document.createdAt).toLocaleDateString()}
                                </span>
                                <span className="mx-1">•</span>
                                <span>{(document.size / 1024).toFixed(1)} KB</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(document.url, '_blank')}
                                title="View document"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownload(document)}
                                title="Download document"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(document)}
                                className="text-destructive hover:text-destructive"
                                title="Delete document"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-2 text-xl font-medium">No documents found</h3>
                        <p className="mt-1 text-muted-foreground">
                          {searchTerm
                            ? "No documents match your search criteria"
                            : "You haven't uploaded any documents yet"}
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentManager;
