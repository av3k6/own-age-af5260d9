
import { useState, useEffect } from 'react';
import { DocumentMetadata } from '@/types/document';
import { useSupabase } from '@/hooks/useSupabase';
import { useToast } from '@/hooks/use-toast';

export const useDocumentManagement = (userId?: string) => {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentMetadata[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const { supabase } = useSupabase();
  const { toast } = useToast();

  // Load documents
  useEffect(() => {
    const loadDocuments = async () => {
      if (!userId) {
        setDocuments([]);
        setFilteredDocuments([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data: files, error } = await supabase.storage
          .from('storage')
          .list(`documents/${userId}`, {
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
            const filePath = `documents/${userId}/${file.name}`;
            const { data: urlData } = supabase.storage
              .from('storage')
              .getPublicUrl(filePath);

            const { data: metaData } = await supabase
              .from('document_metadata')
              .select('*')
              .eq('path', filePath)
              .single();

            const document: DocumentMetadata = {
              id: file.id,
              name: file.name,
              type: file.metadata?.mimetype || 'application/octet-stream',
              size: file.metadata?.size || 0,
              createdAt: file.created_at || new Date().toISOString(),
              updatedAt: file.updated_at || new Date().toISOString(),
              url: urlData.publicUrl,
              path: filePath,
              uploadedBy: userId,
              category: metaData?.category || 'Uncategorized',
              description: metaData?.description || '',
            };

            return document;
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
  }, [userId, supabase, toast]);

  // Filter documents based on search term and category
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

    if (activeCategory !== 'all') {
      filtered = filtered.filter((doc) => doc.category?.toLowerCase() === activeCategory.toLowerCase());
    }

    setFilteredDocuments(filtered);
  }, [searchTerm, activeCategory, documents]);

  const handleDownload = async (doc: DocumentMetadata) => {
    try {
      const { data, error } = await supabase.storage
        .from('storage')
        .download(doc.path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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

  const uniqueCategories = ['all', ...new Set(documents.map(doc => doc.category?.toLowerCase() || 'uncategorized'))];

  return {
    documents: filteredDocuments,
    isLoading,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    categories: uniqueCategories,
    handleDownload,
    handleDelete
  };
};
