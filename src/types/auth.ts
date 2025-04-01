
import { User } from '@/types';

export interface AuthContextType {
  user: User | null;
  isInitialized: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  checkIsAuthenticated: () => Promise<boolean>;
}
