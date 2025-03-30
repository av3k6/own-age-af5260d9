
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { ShowingTable } from "./components/ShowingTable";
import { ShowingDetailsDialog } from "./components/ShowingDetailsDialog";
import { useShowingRequests } from "./hooks/useShowingRequests";
import { ShowingRequestManagerProps } from "./types";

export default function ShowingRequestManager({ isBuyer = false }: ShowingRequestManagerProps) {
  const {
    isLoading,
    activeTab,
    setActiveTab,
    selectedShowing,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isProcessing,
    fetchShowings,
    upcomingShowings,
    pastShowings,
    cancelledShowings,
    handleViewShowing,
    handleUpdateStatus
  } = useShowingRequests(isBuyer);

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
            <ShowingTable
              showingsList={upcomingShowings}
              isLoading={isLoading}
              isBuyer={isBuyer}
              onViewShowing={handleViewShowing}
              onUpdateStatus={handleUpdateStatus}
              isProcessing={isProcessing}
            />
          </TabsContent>
          
          <TabsContent value="past">
            <ShowingTable
              showingsList={pastShowings}
              isLoading={isLoading}
              isBuyer={isBuyer}
              onViewShowing={handleViewShowing}
              onUpdateStatus={handleUpdateStatus}
              isProcessing={isProcessing}
            />
          </TabsContent>
          
          <TabsContent value="cancelled">
            <ShowingTable
              showingsList={cancelledShowings}
              isLoading={isLoading}
              isBuyer={isBuyer}
              onViewShowing={handleViewShowing}
              onUpdateStatus={handleUpdateStatus}
              isProcessing={isProcessing}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <ShowingDetailsDialog 
        showing={selectedShowing}
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onUpdateStatus={handleUpdateStatus}
        isBuyer={isBuyer}
        isProcessing={isProcessing}
      />

      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={fetchShowings}>
          <Loader2 className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
}
