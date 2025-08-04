'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { ACCESS_TOKEN } from '@/constants/tokens';

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
  checkAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const checkAuth = () => {
    // Check for authentication token on client-side
    const token = Cookies.get(ACCESS_TOKEN);
    setIsLoggedIn(!!token);
    return !!token;
  };

  useEffect(() => {
    checkAuth();
    setIsLoading(false);
  }, []);

  const logout = () => {
    router.push('/');
    Cookies.remove(ACCESS_TOKEN);
    setIsLoggedIn(false);
  };

  // If still loading, show nothing or a loading spinner
  if (isLoading) {
    return null; // or return a loading spinner component
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
