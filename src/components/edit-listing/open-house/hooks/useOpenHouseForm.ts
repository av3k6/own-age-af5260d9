
import { useState, useCallback } from "react";
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
  
  // Wrap the handlers in useCallback to prevent re-renders
  const handleAddSession = useCallback(async (data: OpenHouseSessionFormValues) => {
    console.log("Adding session with data:", data);
    const result = await addSession(data);
    if (result) {
      setShowForm(false);
      console.log("Session added successfully:", result);
      return true;
    } else {
      console.error("Failed to add session");
      return false;
    }
  }, [addSession]);
  
  const handleUpdateSession = useCallback(async (data: OpenHouseSessionFormValues) => {
    if (editingSession) {
      const result = await updateSession(editingSession.id, data);
      if (result) {
        setEditingSession(null);
        return true;
      }
      return false;
    }
    return false;
  }, [editingSession, updateSession]);
  
  const handleEditClick = useCallback((session: OpenHouseSession) => {
    setEditingSession(session);
  }, []);
  
  const handleDeleteClick = useCallback(async (id: string) => {
    return await deleteSession(id);
  }, [deleteSession]);
  
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
