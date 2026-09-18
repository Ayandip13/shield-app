import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/auth';
import { saveToken, getToken, removeToken } from '../utils/storage';
import * as authService from '../services/authService';
import { setUnauthorizedHandler } from '../services/apiClient';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  sessionNotice: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedFields: Partial<User>) => void;
  clearSessionNotice: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);

  const handleSessionExpired = async () => {
    await removeToken();
    setToken(null);
    setUser(null);
    setSessionNotice('Your session has expired. Please sign in again.');
  };

  useEffect(() => {
    setUnauthorizedHandler(handleSessionExpired);

    async function loadStoredAuth() {
      try {
        const storedToken = await getToken();
        if (storedToken) {
          setToken(storedToken);
          const currentUser = await authService.fetchCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.warn('Failed to restore session, clearing invalid token:', error);
        await removeToken();
        setToken(null);
        setUser(null);
        setSessionNotice('Your session has expired. Please sign in again.');
      } finally {
        setIsLoading(false);
      }
    }
    loadStoredAuth();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setSessionNotice(null);
    try {
      const data = await authService.login(email, password);
      await saveToken(data.token);
      setToken(data.token);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    setIsLoading(true);
    setSessionNotice(null);
    try {
      await removeToken();
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = (updatedFields: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...updatedFields } : null));
  };

  const clearSessionNotice = () => {
    setSessionNotice(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        sessionNotice,
        login: handleLogin,
        logout: handleLogout,
        updateUser: handleUpdateUser,
        clearSessionNotice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

