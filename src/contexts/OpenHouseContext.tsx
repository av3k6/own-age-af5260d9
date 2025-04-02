
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { OpenHouseSession, OpenHouseSessionFormValues } from "@/types/open-house";
import { useOpenHouseSchedule } from "@/hooks/useOpenHouseSchedule";

interface OpenHouseContextType {
  sessions: OpenHouseSession[];
  isLoading: boolean;
  isSaving: boolean;
  showForm: boolean;
  editingSession: OpenHouseSession | null;
  fetchSessions: () => Promise<void>;
  handleAddSession: (data: OpenHouseSessionFormValues) => Promise<boolean>;
  handleUpdateSession: (data: OpenHouseSessionFormValues) => Promise<boolean>;
  handleEditClick: (session: OpenHouseSession) => void;
  handleDeleteClick: (id: string) => Promise<boolean>;
  handleCancelEdit: () => void;
  handleCancelAdd: () => void;
  handleShowAddForm: () => void;
}

const OpenHouseContext = createContext<OpenHouseContextType | undefined>(undefined);

export const OpenHouseProvider: React.FC<{ propertyId?: string; children: React.ReactNode }> = ({ 
  propertyId, 
  children 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<OpenHouseSession | null>(null);
  
  const { 
    sessions, 
    isLoading, 
    isSaving, 
    fetchSessions, 
    addSession, 
    updateSession, 
    deleteSession 
  } = useOpenHouseSchedule(propertyId);

  // Fetch sessions when the component mounts or propertyId changes
  useEffect(() => {
    console.log("OpenHouseContext: Initializing with propertyId:", propertyId);
    if (propertyId) {
      console.log("OpenHouseContext: Fetching sessions");
      fetchSessions();
    }
    
    return () => {
      console.log("OpenHouseContext: Cleaning up");
    };
  }, [propertyId, fetchSessions]);

  const handleAddSession = useCallback(async (data: OpenHouseSessionFormValues) => {
    console.log("OpenHouseContext: Adding session with data:", data);
    const result = await addSession(data);
    if (result) {
      setShowForm(false);
      console.log("OpenHouseContext: Session added successfully:", result);
      // Fetch sessions again to update the list
      await fetchSessions();
      return true;
    } else {
      console.error("OpenHouseContext: Failed to add session");
      return false;
    }
  }, [addSession, fetchSessions]);

  const handleUpdateSession = useCallback(async (data: OpenHouseSessionFormValues) => {
    console.log("OpenHouseContext: Updating session with data:", data);
    if (editingSession) {
      const result = await updateSession(editingSession.id, data);
      if (result) {
        setEditingSession(null);
        console.log("OpenHouseContext: Session updated successfully");
        // Fetch sessions again to update the list
        await fetchSessions();
        return true;
      }
      console.error("OpenHouseContext: Failed to update session");
      return false;
    }
    return false;
  }, [editingSession, updateSession, fetchSessions]);

  const handleEditClick = useCallback((session: OpenHouseSession) => {
    console.log("OpenHouseContext: Edit session clicked:", session);
    setEditingSession(session);
  }, []);

  const handleDeleteClick = useCallback(async (id: string) => {
    console.log("OpenHouseContext: Delete session clicked:", id);
    const result = await deleteSession(id);
    if (result) {
      console.log("OpenHouseContext: Session deleted successfully");
      // Fetch sessions again to update the list
      await fetchSessions();
    } else {
      console.error("OpenHouseContext: Failed to delete session");
    }
    return result;
  }, [deleteSession, fetchSessions]);

  const handleCancelEdit = useCallback(() => {
    console.log("OpenHouseContext: Cancel edit clicked");
    setEditingSession(null);
  }, []);

  const handleCancelAdd = useCallback(() => {
    console.log("OpenHouseContext: Cancel add clicked");
    setShowForm(false);
  }, []);

  const handleShowAddForm = useCallback(() => {
    console.log("OpenHouseContext: Show add form clicked");
    setShowForm(true);
  }, []);

  return (
    <OpenHouseContext.Provider value={{
      sessions,
      isLoading,
      isSaving,
      showForm,
      editingSession,
      fetchSessions,
      handleAddSession,
      handleUpdateSession,
      handleEditClick,
      handleDeleteClick,
      handleCancelEdit,
      handleCancelAdd,
      handleShowAddForm
    }}>
      {children}
    </OpenHouseContext.Provider>
  );
};

export const useOpenHouse = () => {
  const context = useContext(OpenHouseContext);
  if (context === undefined) {
    throw new Error("useOpenHouse must be used within an OpenHouseProvider");
  }
  return context;
};
