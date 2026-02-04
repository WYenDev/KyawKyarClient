import React, { createContext, useContext, useState, useEffect } from 'react';
import { client } from '../services/mutator'; // Import the axios instance
import { AUTH_EVENTS } from '../utils/auth';
import { usePostApiAuthRefresh, PostApiAuthRefresh200, usePostApiAuthRecoverCodesSaved } from '../services/api';
import type { User, Role } from '../types';


interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  markPasswordChanged: () => void;
  markRecoverCodesSaved: () => void;
  authLoading: boolean;
  logoutMessage: string | null;
  clearLogoutMessage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);

  // THE BRIDGE: Whenever the token changes, update the Axios Client
  useEffect(() => {
    if (user && user.accessToken) {
      client.defaults.headers.common['Authorization'] = `Bearer ${user.accessToken}`;
    } else {
      delete client.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const login = (user: User) => {
    console.log("Logging in user:", user);
    if (user.accessToken) {
      client.defaults.headers.common['Authorization'] = `Bearer ${user.accessToken}`;
      try {
        localStorage.setItem('token', user.accessToken);
      } catch (e) {
        console.error('Failed to save token to localStorage', e);
      }
    }
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    delete client.defaults.headers.common['Authorization'];
    try {
      localStorage.removeItem('token');
    } catch (e) {
        console.error('Failed to remove token from localStorage', e);
    }
    // You would also call your backend /logout to clear the HttpOnly cookie
  };

  const clearLogoutMessage = () => setLogoutMessage(null);


  const markPasswordChanged = () => {
    setUser((prevUser) => prevUser ? { ...prevUser, needPasswordChange: false } : null);
  };



  const {mutate: markRecoverCodesSavedMutate} = usePostApiAuthRecoverCodesSaved({
    mutation: {
      onSuccess: () => {
          setUser(prevUser => prevUser ? { ...prevUser, recoverCodesSaved: true } : null);
        setAuthLoading(false);
      },
      onError: () => {
        setAuthLoading(false);
        // Handle error if needed
      }
    }
  });


  const markRecoverCodesSaved = () => {
    setAuthLoading(true);
    if (user?.username) markRecoverCodesSavedMutate({data: {username: user?.username}});
  };


 const { mutate: refreshSession } = usePostApiAuthRefresh({
    mutation: {
      onSuccess: (data: PostApiAuthRefresh200) => {
        if (data.username !==  undefined && data.accessToken !== undefined && data.needPasswordChange !== undefined && data.role !== undefined) {
          console.log('Tokens are defined')
          
          login({username: data.username,accessToken: data.accessToken,needPasswordChange: data.needPasswordChange, role: data.role as Role, resetPassword: data.resetPassword ?? false, recoverCodesSaved: data.recoverCodesSaved ?? false});
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

  // Listen for invalid token events broadcast by axios interceptor
  useEffect(() => {
    const handler = () => {
      setLogoutMessage('Your session has expired. Please log in again.');
      logout();
      setAuthLoading(false);
    };
    window.addEventListener(AUTH_EVENTS.ACCESS_TOKEN_INVALID, handler);
    return () => window.removeEventListener(AUTH_EVENTS.ACCESS_TOKEN_INVALID, handler);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, markPasswordChanged, markRecoverCodesSaved, authLoading, logoutMessage, clearLogoutMessage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
