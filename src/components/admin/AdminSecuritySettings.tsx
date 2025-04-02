
import React from "react";
import PasswordSettings from "./security/PasswordSettings";
import TwoFactorAuthentication from "./security/TwoFactorAuthentication";

const AdminSecuritySettings = () => {
  return (
    <div className="space-y-6">
      <PasswordSettings />
      <TwoFactorAuthentication />
    </div>
  );
};

export default AdminSecuritySettings;
