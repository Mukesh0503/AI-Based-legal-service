
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define types for our authentication context
interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('legalUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('legalUser');
      }
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll just check for a valid email format and any password
      if (!email.includes('@') || password.length < 6) {
        return false;
      }

      // Simulate successful login with mock data
      const mockUser = {
        id: `user_${Math.random().toString(36).substring(2, 9)}`,
        name: email.split('@')[0],
        email,
        profileImage: null,
      };

      setUser(mockUser);
      localStorage.setItem('legalUser', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      if (!email.includes('@') || password.length < 6 || !name) {
        return false;
      }

      // Simulate successful signup
      const mockUser = {
        id: `user_${Math.random().toString(36).substring(2, 9)}`,
        name,
        email,
        profileImage: null,
      };

      setUser(mockUser);
      localStorage.setItem('legalUser', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('legalUser');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
