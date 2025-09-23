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
        const jenniferId = '68973614-94db-4f98-9729-0712e0c5c0fa';
        const umaId   = 'e47beacf-c098-4286-b417-3d45c94bd968';

        // Read query string (e.g. ?user=jennifer or ?user=uma)
        const params = new URLSearchParams(window.location.search);
        const userKey = params.get('user') || 'jennifer'; // default to jennifer

        const selectedId = userKey === 'anthony' ? umaId : jenniferId;

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
