import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { User } from '../../types/user';
import { Badge } from '../ui/badge';
import { useBots } from '../../hooks/useBots';
import BotManager from '../bots/BotManager';

interface UserProfileProps {
  userId: string;
  isOwnProfile?: boolean;
}

export const UserProfile = ({ userId, isOwnProfile = false }: UserProfileProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { bots } = useBots(userId);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await userService.getUserById(userId);
        setUser(userData);
      } catch (err) {
        setError('Failed to load user');
        console.error('Failed to load user:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!user) return <div className="p-4">User not found</div>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <div className="text-center">
        <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">
            {user.displayName?.[0] || user.username[0].toUpperCase()}
          </span>
        </div>
        
        <h1 className="text-2xl font-bold">{user.displayName || user.username}</h1>
        <p className="text-gray-600 text-lg">@{user.username}</p>
        
        <div className="mt-4">
          <Badge variant={user.accountStatus === 'ACTIVE' ? 'default' : 'destructive'}>
            {user.accountStatus}
          </Badge>
        </div>
        
        {isOwnProfile && (
          <div className="mt-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Edit Profile
            </button>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-500">
          Member since {new Date(user.createdTimestamp).toLocaleDateString()}
        </div>
      </div>

      {isOwnProfile && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">My Bots ({bots.length})</h2>
          <BotManager userId={userId} />
        </div>
      )}
    </div>
  );
};

export default UserProfile;