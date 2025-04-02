
export interface AdminSession {
  authenticated: boolean;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  expiresAt: string;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
}

export interface AdminProfile {
  username: string;
  email: string;
}
