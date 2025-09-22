import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { User } from '../types/user';

// Shape of our authentication context
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

        // Demo UUIDs from your seed file
        const aliceId = '68973614-94db-4f98-9729-0712e0c5c0fa';
        const umaId   = '962f18a5-f888-4886-b93d-a763ff8c9d98';

        // Read query string (e.g. ?user=alice or ?user=uma)
        const params = new URLSearchParams(window.location.search);
        const userKey = params.get('user') || 'alice'; // default to alice

        const selectedId = userKey === 'uma' ? umaId : aliceId;

        const userData = await userService.getUserById(selectedId);

        console.log("Fetched user from API:", userData);
        setCurrentUser(userData);

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
