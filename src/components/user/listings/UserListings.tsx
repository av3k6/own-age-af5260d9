import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Plus, Calendar, Clock } from "lucide-react";
import ShowingRequestManager from "../showings/ShowingRequestManager";
import SellerAvailabilityManager from "../showings/SellerAvailabilityManager";
import { useUserListings } from "./useUserListings";
import { ListingsTabContent } from "./ListingsTabContent";
import { DbActions } from "./DbActions";

const UserListings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("listings");
  const { 
    isLoading, 
    listings, 
    error, 
    dataSource, 
    debugInfo, 
    setListings, 
    setDataSource 
  } = useUserListings();

  const handleCreateListing = () => {
    navigate("/sell");
  };
  
  const refreshListings = (mockOnly: boolean) => {
    if (mockOnly) {
      // Keep only mock data
      const mockOnlyListings = listings.filter(
        listing => (listing as any).source === 'mock'
      );
      setListings(mockOnlyListings);
      setDataSource('mock');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Property Management</CardTitle>
          <CardDescription>Manage your listings and showings</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateListing}>
            <Plus className="h-4 w-4 mr-2" /> New Listing
          </Button>
          <DbActions refreshListings={refreshListings} />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Your Listings</span>
            </TabsTrigger>
            <TabsTrigger value="showings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Showing Requests</span>
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Availability</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings">
            <ListingsTabContent
              isLoading={isLoading}
              error={error}
              listings={listings}
              dataSource={dataSource}
              debugInfo={debugInfo}
            />
          </TabsContent>
          
          <TabsContent value="showings">
            <ShowingRequestManager isBuyer={false} />
          </TabsContent>
          
          <TabsContent value="availability">
            <SellerAvailabilityManager />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserListings;
