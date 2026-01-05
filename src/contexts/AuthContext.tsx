import React, { createContext, useContext, useState, useEffect } from 'react';
import { client } from '../services/mutator'; // Import the axios instance
import { usePostApiAuthRefresh, PostApiAuthRefresh200 } from '../services/api';
import type { User, Role } from '../types';


interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  setRequirePasswordChange: (flag: boolean) => void;
  markPasswordChanged: () => void;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needPasswordChange, setNeedPasswordChange] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // THE BRIDGE: Whenever the token changes, update the Axios Client
  useEffect(() => {
    if (accessToken) {
      client.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      delete client.defaults.headers.common['Authorization'];
    }
  }, [accessToken]);

  const login = (user: User) => {
    setUser(user);
    setAccessToken(user.accessToken);
    console.log("Setting needPasswordChange to:", needPasswordChange);
    setNeedPasswordChange(needPasswordChange);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setNeedPasswordChange(false);
    // You would also call your backend /logout to clear the HttpOnly cookie
  };

  const setRequirePasswordChange = (flag: boolean) => {
    setNeedPasswordChange(flag);
  };

  const markPasswordChanged = () => {
    setNeedPasswordChange(false);
  };


  const { mutate: refreshSession } = usePostApiAuthRefresh({
    mutation: {
      onSuccess: (data: PostApiAuthRefresh200) => {
        if (data.username !==  undefined && data.accessToken !== undefined && data.needPasswordChange !== undefined && data.role !== undefined) {
          console.log('Tokens are defined')
          
          login({username: data.username,accessToken: data.accessToken,needPasswordChange: data.needPasswordChange, role: data.role as Role});
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
    <AuthContext.Provider value={{ user, login, logout, setRequirePasswordChange, markPasswordChanged, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
