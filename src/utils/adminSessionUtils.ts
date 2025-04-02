
import { AdminSession, AdminProfile } from "@/types/admin";

export const getAdminSessionFromStorage = (): AdminSession | null => {
  try {
    const adminSessionStr = localStorage.getItem("admin_session");
    if (!adminSessionStr) return null;
    
    return JSON.parse(adminSessionStr);
  } catch (error) {
    console.error("Error parsing admin session:", error);
    return null;
  }
};

export const saveAdminSessionToStorage = (adminSession: AdminSession): void => {
  localStorage.setItem("admin_session", JSON.stringify(adminSession));
};

export const removeAdminSessionFromStorage = (): void => {
  localStorage.removeItem("admin_session");
};

export const isAdminSessionValid = (): boolean => {
  try {
    const adminSession = getAdminSessionFromStorage();
    if (!adminSession) return false;
    
    const now = new Date();
    const expiresAt = new Date(adminSession.expiresAt);
    
    if (now > expiresAt) {
      removeAdminSessionFromStorage();
      return false;
    }
    
    return adminSession.authenticated && adminSession.isAdmin;
  } catch (error) {
    console.error("Error validating admin session:", error);
    return false;
  }
};

export const getAdminProfileFromSession = (): AdminProfile | null => {
  try {
    const adminSession = getAdminSessionFromStorage();
    if (!adminSession) return null;
    
    return {
      username: adminSession.username,
      email: adminSession.email || "admin@redmondgroup.ca",
    };
  } catch (error) {
    console.error("Error getting admin profile:", error);
    return null;
  }
};
