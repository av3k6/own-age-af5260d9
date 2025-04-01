
import { User } from '@/types';

export type SessionStatus = 'active' | 'expired' | 'unauthenticated' | 'error';

export interface AuthContextType {
  user: User | null;
  isInitialized: boolean;
  loading: boolean;
  sessionStatus?: SessionStatus;
  signIn: (email: string, password: string) => Promise<{ error: any; data?: any }>;
  signUp: (email: string, password: string, userData: { name?: string; role?: string }) => Promise<{ error: any; data?: any }>;
  signOut: () => Promise<{ error: any }>;
  checkIsAuthenticated: () => Promise<boolean>;
  refreshSession?: () => Promise<boolean>;
}

export interface AuthErrorResponse {
  message: string;
  status?: number;
  code?: string;
}

export interface AuthSuccessResponse<T = any> {
  data: T;
}
