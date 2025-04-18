
import { useEffect } from "react";
import OpenHouseForm from "./OpenHouseForm";
import OpenHouseList from "./OpenHouseList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useOpenHouse } from "@/contexts/OpenHouseContext";

interface OpenHouseTabProps {
  propertyId?: string;
}

export default function OpenHouseTab({ propertyId }: OpenHouseTabProps) {
  // Use the context instead of the hook directly
  const {
    sessions,
    isLoading,
    showForm,
    editingSession,
    handleAddSession,
    handleUpdateSession,
    handleEditClick,
    handleDeleteClick,
    handleCancelEdit,
    handleCancelAdd,
    handleShowAddForm
  } = useOpenHouse();

  // Add debug logging
  useEffect(() => {
    console.log("OpenHouseTab: Rendered with propertyId:", propertyId);
    console.log("OpenHouseTab: Current sessions:", sessions);
    console.log("OpenHouseTab: showForm:", showForm);
    console.log("OpenHouseTab: editingSession:", editingSession);
    
    return () => {
      console.log("OpenHouseTab: Unmounting");
    };
  }, [propertyId, sessions, showForm, editingSession]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p>Loading open house schedule...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Open House Schedule</h2>
          <p className="text-muted-foreground">
            Set up dates and times when potential buyers can visit this property
          </p>
        </div>
        
        {!showForm && !editingSession && (
          <Button onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            handleShowAddForm();
          }}>
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Open House
          </Button>
        )}
      </div>
      
      <Separator />
      
      {showForm && (
        <div className="bg-muted/50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-4">Add New Open House</h3>
          <OpenHouseForm
            onSubmit={handleAddSession}
            onCancel={handleCancelAdd}
          />
        </div>
      )}
      
      {editingSession && (
        <div className="bg-muted/50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-4">Edit Open House</h3>
          <OpenHouseForm
            defaultValues={{
              date: editingSession.date,
              startTime: editingSession.startTime,
              endTime: editingSession.endTime,
              notes: editingSession.notes,
            }}
            onSubmit={handleUpdateSession}
            onCancel={handleCancelEdit}
            isEditing
          />
        </div>
      )}
      
      <div className="mt-4">
        <OpenHouseList
          sessions={sessions}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>
    </div>
  );
}
