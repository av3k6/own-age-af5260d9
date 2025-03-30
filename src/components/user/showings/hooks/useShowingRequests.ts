
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { ShowingStatus, ListingStatus, PropertyType } from "@/types";
import { ShowingWithProperty } from "../types";
import { toast } from "sonner";

export const useShowingRequests = (isBuyer: boolean = false) => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { toast: toastHook } = useToast();
  const [showings, setShowings] = useState<ShowingWithProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedShowing, setSelectedShowing] = useState<ShowingWithProperty | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchShowings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      let query = supabase
        .from('showings')
        .select(`
          *,
          properties:property_id (
            id,
            title,
            address,
            images
          ),
          sellers:seller_id (
            id,
            name,
            email,
            phone
          ),
          buyers:buyer_id (
            id,
            name,
            email,
            phone
          )
        `);

      if (isBuyer) {
        query = query.eq('buyer_id', user.id);
      } else {
        query = query.eq('seller_id', user.id);
      }
      
      const { data, error } = await query.order('start_time', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        const formattedShowings = data.map(item => {
          const showing: ShowingWithProperty = {
            id: item.id,
            propertyId: item.property_id,
            buyerId: item.buyer_id,
            sellerId: item.seller_id,
            startTime: new Date(item.start_time),
            endTime: new Date(item.end_time),
            status: item.status as ShowingStatus,
            notes: item.notes,
            createdAt: new Date(item.created_at),
            updatedAt: new Date(item.updated_at),
            buyerName: item.buyer_name || item.buyers?.name,
            buyerEmail: item.buyer_email || item.buyers?.email,
            buyerPhone: item.buyer_phone || item.buyers?.phone,
            sellerName: item.sellers?.name,
            property: item.properties ? {
              id: item.properties.id,
              title: item.properties.title,
              address: item.properties.address,
              images: item.properties.images || [],
              description: "",
              price: 0,
              propertyType: PropertyType.HOUSE,
              bedrooms: 0,
              bathrooms: 0,
              squareFeet: 0,
              yearBuilt: 0,
              features: [],
              sellerId: item.seller_id,
              status: ListingStatus.ACTIVE,
              createdAt: new Date(),
              updatedAt: new Date()
            } : undefined
          };
          return showing;
        });
        
        setShowings(formattedShowings);
      }
    } catch (error) {
      console.error("Error fetching showings:", error);
      toastHook({
        title: "Error",
        description: "Failed to load showing requests.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchShowings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, supabase, isBuyer]);
  
  const upcomingShowings = showings.filter(s => 
    (s.status === ShowingStatus.APPROVED || s.status === ShowingStatus.REQUESTED) && 
    new Date(s.startTime) >= new Date()
  );
  
  const pastShowings = showings.filter(s => 
    s.status === ShowingStatus.COMPLETED || 
    (s.status === ShowingStatus.APPROVED && new Date(s.startTime) < new Date())
  );
  
  const cancelledShowings = showings.filter(s => 
    s.status === ShowingStatus.CANCELLED || s.status === ShowingStatus.DECLINED
  );
  
  const handleViewShowing = (showing: ShowingWithProperty) => {
    setSelectedShowing(showing);
    setIsViewDialogOpen(true);
  };
  
  const handleUpdateStatus = async (showingId: string, newStatus: ShowingStatus) => {
    if (!user) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('showings')
        .update({ 
          status: newStatus,
          updated_at: new Date()
        })
        .eq('id', showingId);
        
      if (error) throw error;
      
      setShowings(prev => 
        prev.map(s => 
          s.id === showingId 
            ? { ...s, status: newStatus, updatedAt: new Date() } 
            : s
        )
      );
      
      if (selectedShowing && selectedShowing.id === showingId) {
        setSelectedShowing({
          ...selectedShowing,
          status: newStatus,
          updatedAt: new Date()
        });
      }
      
      toast.success(`Showing ${newStatus.toLowerCase()} successfully`);
      
      setIsViewDialogOpen(false);
      
      const showing = showings.find(s => s.id === showingId);
      if (showing) {
        console.log(`Notification for showing ${showingId}: Status changed to ${newStatus}`);
      }
      
    } catch (error) {
      console.error(`Error updating showing status to ${newStatus}:`, error);
      toast.error(`Failed to update showing status`);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    showings,
    isLoading,
    activeTab,
    setActiveTab,
    selectedShowing,
    setSelectedShowing,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isProcessing,
    fetchShowings,
    upcomingShowings,
    pastShowings,
    cancelledShowings,
    handleViewShowing,
    handleUpdateStatus
  };
};
