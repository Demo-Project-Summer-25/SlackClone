import { useState, useEffect } from 'react';
import { User, UserUpdateRequest } from '../types/user';
import { userService } from '../services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await userService.getAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchAllUsers,
  };
};

export const useUser = (userId: string | null) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUser = await userService.getUserById(id);
      setUser(fetchedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (request: UserUpdateRequest) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateUser(userId, request);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  return {
    user,
    loading,
    error,
    updateUser,
    refetch: () => userId && fetchUser(userId),
  };
};