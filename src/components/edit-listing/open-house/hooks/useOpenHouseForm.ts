
import { useState } from "react";
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
  
  const handleAddSession = async (data: OpenHouseSessionFormValues) => {
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
  };
  
  const handleUpdateSession = async (data: OpenHouseSessionFormValues) => {
    if (editingSession) {
      const result = await updateSession(editingSession.id, data);
      if (result) {
        setEditingSession(null);
        return true;
      }
      return false;
    }
    return false;
  };
  
  const handleEditClick = (session: OpenHouseSession) => {
    setEditingSession(session);
  };
  
  const handleDeleteClick = async (id: string) => {
    return await deleteSession(id);
  };
  
  const handleCancelEdit = () => {
    setEditingSession(null);
  };
  
  const handleCancelAdd = () => {
    setShowForm(false);
  };
  
  const handleShowAddForm = () => {
    setShowForm(true);
  };

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
