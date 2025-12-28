import React, { createContext, useContext, useState, useEffect } from 'react';
import { client } from '../services/mutator'; // Import the axios instance
import { usePostApiAuthRefresh } from '../services/api';

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (username: string, token: string) => void;
  logout: () => void;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // THE BRIDGE: Whenever the token changes, update the Axios Client
  useEffect(() => {
    if (accessToken) {
      client.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      delete client.defaults.headers.common['Authorization'];
    }
  }, [accessToken]);

  const login = (username: string, token: string) => {
    setUser({ username });
    setAccessToken(token);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    // You would also call your backend /logout to clear the HttpOnly cookie
  };


const { mutate: refreshSession } = usePostApiAuthRefresh({
    mutation: {
      onSuccess: (data) => {
        // Restore state from the cookie's valid session
        if (data.accessToken && data.username) {
          login(data.username, data.accessToken);
        }
        setAuthLoading(false);
      },
      onError: () => {
        logout();
        setAuthLoading(false);
      }
    }
  });

  useEffect(() => {
    // Check if we have a session cookie on mount
    refreshSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
