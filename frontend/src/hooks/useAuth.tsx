import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserService } from '../services/userService';
import { User } from '../types/user';

// The shape of our authentication context
interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
}

// Props for the provider
interface AuthProviderProps {
  children: React.ReactNode;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: AuthProviderProps): React.ReactElement => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDemoUser = async () => {
      try {
        // Demo UUID from your seed file (Alice)
        const demoUserId = '68973614-94db-4f98-9729-0712e0c5c0fa';
        const user = await UserService.getUserById(demoUserId);
        console.log("Fetched user from API:", user);
        setCurrentUser(user);

      } catch (error) {
        console.error('Failed to fetch demo user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemoUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );

};

// Custom hook to consume context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
