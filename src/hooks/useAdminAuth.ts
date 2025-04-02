
import { useState } from "react";
import { useAdminLogin } from "./admin/useAdminLogin";
import { useAdminProfile } from "./admin/useAdminProfile";
import { useAdminSecurity } from "./admin/useAdminSecurity";
import { useAdminSession } from "./admin/useAdminSession";

export const useAdminAuth = () => {
  const { loginAsAdmin, isLoading } = useAdminLogin();
  const { getAdminData, updateAdminProfile } = useAdminProfile();
  const { 
    resetAdminPassword,
    is2FAEnabled,
    getTwoFactorSecret,
    setup2FA,
    verify2FA,
    disable2FA
  } = useAdminSecurity();
  const { checkAdminAuth, logoutAdmin } = useAdminSession();

  return {
    loginAsAdmin,
    checkAdminAuth,
    logoutAdmin,
    getAdminData,
    updateAdminProfile,
    resetAdminPassword,
    is2FAEnabled,
    getTwoFactorSecret,
    setup2FA,
    verify2FA,
    disable2FA,
    isLoading
  };
};
