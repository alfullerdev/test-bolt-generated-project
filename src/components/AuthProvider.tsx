import React, { createContext, useContext, useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { getCurrentUser } from '../lib/auth';
import { UserType } from '../types';

interface AuthContextType {
  auth: { type: UserType; user: any } | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  auth: null,
  loading: true,
  refreshAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<{ type: UserType; user: any } | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      const user = await getCurrentUser();
      setAuth(user);
    } catch (error) {
      console.error('Error refreshing auth:', error);
      setAuth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ auth, loading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
