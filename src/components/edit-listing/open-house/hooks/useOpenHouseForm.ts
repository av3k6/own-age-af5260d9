
import { useState, useCallback, useEffect } from "react";
import { OpenHouseSession, OpenHouseSessionFormValues } from "@/types/open-house";
import { useOpenHouseSchedule } from "@/hooks/useOpenHouseSchedule";

export const useOpenHouseForm = (propertyId?: string) => {
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
    if (propertyId) {
      fetchSessions();
    }
  }, [propertyId, fetchSessions]);
  
  // Wrap the handlers in useCallback to prevent re-renders
  const handleAddSession = useCallback(async (data: OpenHouseSessionFormValues) => {
    console.log("Adding session with data:", data);
    const result = await addSession(data);
    if (result) {
      setShowForm(false);
      console.log("Session added successfully:", result);
      // Fetch sessions again to update the list
      await fetchSessions();
      return true;
    } else {
      console.error("Failed to add session");
      return false;
    }
  }, [addSession, fetchSessions]);
  
  const handleUpdateSession = useCallback(async (data: OpenHouseSessionFormValues) => {
    if (editingSession) {
      const result = await updateSession(editingSession.id, data);
      if (result) {
        setEditingSession(null);
        // Fetch sessions again to update the list
        await fetchSessions();
        return true;
      }
      return false;
    }
    return false;
  }, [editingSession, updateSession, fetchSessions]);
  
  const handleEditClick = useCallback((session: OpenHouseSession) => {
    setEditingSession(session);
  }, []);
  
  const handleDeleteClick = useCallback(async (id: string) => {
    const result = await deleteSession(id);
    if (result) {
      // Fetch sessions again to update the list
      await fetchSessions();
    }
    return result;
  }, [deleteSession, fetchSessions]);
  
  const handleCancelEdit = useCallback(() => {
    setEditingSession(null);
  }, []);
  
  const handleCancelAdd = useCallback(() => {
    setShowForm(false);
  }, []);
  
  const handleShowAddForm = useCallback(() => {
    setShowForm(true);
  }, []);

  return {
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
  };
};
