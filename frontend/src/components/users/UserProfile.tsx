import React, { useState } from 'react';
import { useUser } from '../../hooks/useUsers';
import { useBots } from '../../hooks/useBots';
import UserEditModal from './UserEditModal';
import BotManager from '../bots/BotManager';

interface UserProfileProps {
  userId: string;
  isOwnProfile?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, isOwnProfile = false }) => {
  const { user, loading, error, updateUser } = useUser(userId);
  const { bots } = useBots(userId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img 
          src={user.profilePictureUrl || '/default-avatar.png'} 
          alt={user.displayName || user.username}
          className="profile-avatar"
        />
        <div className="profile-info">
          <h1>{user.displayName || user.username}</h1>
          <p className="username">@{user.username}</p>
          <p className="email">{user.email}</p>
          <span className={`status-indicator ${user.status?.toLowerCase()}`}>
            {user.status}
          </span>
          {user.bio && <p className="bio">{user.bio}</p>}
        </div>
        {isOwnProfile && (
          <button onClick={() => setIsEditModalOpen(true)}>
            Edit Profile
          </button>
        )}
      </div>

      {isOwnProfile && (
        <div className="user-bots-section">
          <h2>My Bots ({bots.length})</h2>
          <BotManager userId={userId} />
        </div>
      )}

      {isEditModalOpen && (
        <UserEditModal
          user={user}
          onUpdate={updateUser}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;