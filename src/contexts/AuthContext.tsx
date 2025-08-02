
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth as useSupabaseAuth } from '@/hooks/useAuth';

interface AuthContextType {
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useSupabaseAuth();

  const value: AuthContextType = {
    user: auth.user,
    loading: auth.loading,
    signIn: async (email: string, password: string) => {
      // Implementation would go here
    },
    signUp: async (email: string, password: string) => {
      // Implementation would go here
    },
    signOut: async () => {
      // Implementation would go here
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
