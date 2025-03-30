import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Showing, ShowingStatus, PropertyListing, PropertyType, ListingStatus } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/formatters";
import { 
  Loader2, 
  Calendar, 
  ChevronDown, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MoreHorizontal, 
  User,
  Phone,
  Mail,
  MessageSquare, 
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface ShowingRequestManagerProps {
  isBuyer?: boolean;
}

interface ShowingWithProperty extends Showing {
  property?: PropertyListing;
  sellerName?: string;
  buyerName?: string;
}

const getStatusBadge = (status: ShowingStatus) => {
  switch (status) {
    case ShowingStatus.REQUESTED:
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Requested</Badge>;
    case ShowingStatus.APPROVED:
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
    case ShowingStatus.DECLINED:
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Declined</Badge>;
    case ShowingStatus.COMPLETED:
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Completed</Badge>;
    case ShowingStatus.CANCELLED:
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const formatAddress = (address: any) => {
  if (!address) return "Address not available";
  return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
};

export default function ShowingRequestManager({ isBuyer = false }: ShowingRequestManagerProps) {
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
  
  const renderActions = (showing: ShowingWithProperty) => {
    if (isProcessing) {
      return (
        <Button variant="ghost" size="icon" disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      );
    }
    
    if (!isBuyer && showing.status === ShowingStatus.REQUESTED) {
      return (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-green-500 text-green-600 hover:bg-green-50"
            onClick={() => handleUpdateStatus(showing.id, ShowingStatus.APPROVED)}
          >
            <CheckCircle className="h-4 w-4 mr-1" /> Approve
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-red-500 text-red-600 hover:bg-red-50"
            onClick={() => handleUpdateStatus(showing.id, ShowingStatus.DECLINED)}
          >
            <XCircle className="h-4 w-4 mr-1" /> Decline
          </Button>
        </div>
      );
    }
    
    if (showing.status === ShowingStatus.APPROVED) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => handleUpdateStatus(showing.id, ShowingStatus.CANCELLED)}
              className="text-red-600"
            >
              <XCircle className="h-4 w-4 mr-2" /> 
              Cancel Showing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewShowing(showing)}>
              <ExternalLink className="h-4 w-4 mr-2" /> 
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    
    if (showing.status === ShowingStatus.COMPLETED || 
        (showing.status === ShowingStatus.APPROVED && new Date(showing.startTime) < new Date())) {
      
      if (showing.status === ShowingStatus.APPROVED && !isBuyer) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => handleUpdateStatus(showing.id, ShowingStatus.COMPLETED)}
              >
                <CheckCircle className="h-4 w-4 mr-2" /> 
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewShowing(showing)}>
                <ExternalLink className="h-4 w-4 mr-2" /> 
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
      
      return (
        <Button variant="ghost" size="icon" onClick={() => handleViewShowing(showing)}>
          <ExternalLink className="h-5 w-5" />
        </Button>
      );
    }
    
    return (
      <Button variant="ghost" size="icon" onClick={() => handleViewShowing(showing)}>
        <ExternalLink className="h-5 w-5" />
      </Button>
    );
  };

  const renderShowingDetails = () => {
    if (!selectedShowing) return null;
    
    return (
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Showing Details</DialogTitle>
            <DialogDescription>
              {selectedShowing.property?.title || 'Property Showing Request'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-md overflow-hidden bg-muted">
                {selectedShowing.property?.images && selectedShowing.property.images.length > 0 ? (
                  <img 
                    src={selectedShowing.property.images[0]} 
                    alt={selectedShowing.property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{selectedShowing.property?.title || 'Property'}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedShowing.property?.address 
                    ? formatAddress(selectedShowing.property.address)
                    : 'Address not available'}
                </p>
                <div className="mt-2">
                  {getStatusBadge(selectedShowing.status)}
                </div>
              </div>
            </div>
            
            <div className="rounded-md border p-4 bg-muted/10 space-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">{formatDate(selectedShowing.startTime)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {formatTime(selectedShowing.startTime)} - {formatTime(selectedShowing.endTime)}
                </span>
              </div>
            </div>
            
            {isBuyer ? (
              <div className="rounded-md border p-4 space-y-2">
                <h4 className="text-sm font-medium">Seller Information</h4>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{selectedShowing.sellerName || 'Seller'}</span>
                </div>
                {selectedShowing.status === ShowingStatus.APPROVED && (
                  <>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`mailto:seller@example.com`} className="text-primary">
                        Contact Seller
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Contact information is available after your request is approved.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="rounded-md border p-4 space-y-2">
                <h4 className="text-sm font-medium">Buyer Information</h4>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{selectedShowing.buyerName || 'Buyer'}</span>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={`mailto:${selectedShowing.buyerEmail}`} className="text-primary">
                    {selectedShowing.buyerEmail}
                  </a>
                </div>
                
                {selectedShowing.buyerPhone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`tel:${selectedShowing.buyerPhone}`} className="text-primary">
                      {selectedShowing.buyerPhone}
                    </a>
                  </div>
                )}
              </div>
            )}
            
            {selectedShowing.notes && (
              <div className="rounded-md border p-4">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Notes</h4>
                    <p className="text-sm mt-1">{selectedShowing.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            {!isBuyer && selectedShowing.status === ShowingStatus.REQUESTED && (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="border-green-500 text-green-600 hover:bg-green-50"
                  onClick={() => handleUpdateStatus(selectedShowing.id, ShowingStatus.APPROVED)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Approve
                </Button>
                <Button 
                  variant="outline"
                  className="border-red-500 text-red-600 hover:bg-red-50"
                  onClick={() => handleUpdateStatus(selectedShowing.id, ShowingStatus.DECLINED)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Decline
                </Button>
              </div>
            )}
            
            {selectedShowing.status === ShowingStatus.APPROVED && (
              <Button 
                variant="destructive"
                onClick={() => handleUpdateStatus(selectedShowing.id, ShowingStatus.CANCELLED)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Cancel Showing
              </Button>
            )}
            
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderShowingsTable = (showingsList: ShowingWithProperty[]) => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
    
    if (showingsList.length === 0) {
      return (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mt-2">No showings found</p>
        </div>
      );
    }
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>{isBuyer ? 'Seller' : 'Buyer'}</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {showingsList.map((showing) => (
            <TableRow key={showing.id}>
              <TableCell>
                <div className="font-medium">{formatDate(showing.startTime)}</div>
                <div className="text-sm text-muted-foreground">
                  {formatTime(showing.startTime)} - {formatTime(showing.endTime)}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{showing.property?.title || 'Property'}</div>
                <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                  {showing.property?.address ? formatAddress(showing.property.address) : 'Address not available'}
                </div>
              </TableCell>
              <TableCell>
                {isBuyer ? showing.sellerName || 'Seller' : showing.buyerName || 'Buyer'}
              </TableCell>
              <TableCell>{getStatusBadge(showing.status)}</TableCell>
              <TableCell className="text-right">
                {renderActions(showing)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Showing Requests</CardTitle>
        <CardDescription>
          {isBuyer 
            ? "Manage your property viewing appointments" 
            : "Handle showing requests from interested buyers"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingShowings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastShowings.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledShowings.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {renderShowingsTable(upcomingShowings)}
          </TabsContent>
          
          <TabsContent value="past">
            {renderShowingsTable(pastShowings)}
          </TabsContent>
          
          <TabsContent value="cancelled">
            {renderShowingsTable(cancelledShowings)}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {renderShowingDetails()}

      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={fetchShowings}>
          <Loader2 className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
}
