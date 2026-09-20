import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/auth';
import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  removeTokens,
} from '../utils/storage';
import * as authService from '../services/authService';
import { setUnauthorizedHandler } from '../services/apiClient';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  sessionNotice: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
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
    await removeTokens();
    setToken(null);
    setUser(null);
    setSessionNotice('Your session has expired. Please sign in again.');
  };

  useEffect(() => {
    setUnauthorizedHandler(handleSessionExpired);

    async function loadStoredAuth() {
      try {
        const storedAccessToken = await getAccessToken();
        const storedRefreshToken = await getRefreshToken();

        if (storedAccessToken || storedRefreshToken) {
          if (storedAccessToken) {
            setToken(storedAccessToken);
          }
          // Fetch user profile; if access token expired, apiClient automatically uses refreshToken
          const currentUser = await authService.fetchCurrentUser();
          setUser(currentUser);

          const updatedAccessToken = await getAccessToken();
          if (updatedAccessToken) {
            setToken(updatedAccessToken);
          }
        }
      } catch (error) {
        console.warn('Failed to restore session, clearing invalid tokens:', error);
        await removeTokens();
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
      await saveTokens(data.accessToken, data.refreshToken);
      setToken(data.accessToken);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    setIsLoading(true);
    setSessionNotice(null);
    try {
      const currentRefreshToken = await getRefreshToken();
      await authService.logoutSession(currentRefreshToken || undefined);
      await removeTokens();
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAll = async (): Promise<void> => {
    setIsLoading(true);
    setSessionNotice(null);
    try {
      await authService.logoutAllSessions();
      await removeTokens();
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
        logoutAll: handleLogoutAll,
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
