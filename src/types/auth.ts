
import { User } from '@/types';

export interface AuthContextType {
  user: User | null;
  isInitialized: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; data?: any }>;
  signUp: (email: string, password: string, userData: { name?: string }) => Promise<{ error: any; data?: any }>;
  signOut: () => Promise<{ error: any }>;
  checkIsAuthenticated: () => Promise<boolean>;
}
