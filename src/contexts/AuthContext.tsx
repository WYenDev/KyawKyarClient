import React, { createContext, useContext, useState, useEffect } from 'react';
import { client } from '../services/mutator'; // Import the axios instance

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (username: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

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

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
