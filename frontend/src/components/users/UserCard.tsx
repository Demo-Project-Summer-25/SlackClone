import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types/user';

interface UserCardProps {
  user: User;
  showActions?: boolean;
  onClick?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, showActions = false, onClick }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ONLINE': return '#10b981'; // Green
      case 'AWAY': return '#f59e0b';   // Yellow
      case 'BUSY': return '#ef4444';   // Red
      case 'OFFLINE': 
      default: return '#6b7280';       // Gray
    }
  };

  const getStatusEmoji = (status?: string) => {
    switch (status) {
      case 'ONLINE': return '';
      case 'AWAY': return '';
      case 'BUSY': return '';
      case 'OFFLINE': return '';
      default: return '';
    }
  };

  const cardContent = (
    <div className="user-card" onClick={onClick}>
      <div className="user-avatar-container">
        <img 
          src={user.profilePictureUrl || '/default-avatar.png'} 
          alt={user.username}
          className="user-avatar"
        />
        <div 
          className="status-dot"
          style={{ backgroundColor: getStatusColor(user.status) }}
          title={user.status}
        />
      </div>
      
      <div className="user-info">
        <h3 className="user-name">
          {user.displayName || user.username}
        </h3>
        <p className="username">@{user.username}</p>
        <p className="user-email">{user.email}</p>
        
        <div className="user-status">
          <span className="status-emoji">{getStatusEmoji(user.status)}</span>
          <span className="status-text">{user.status || 'OFFLINE'}</span>
        </div>

        {user.bio && (
          <p className="user-bio" title={user.bio}>
            {user.bio.length > 60 ? `${user.bio.substring(0, 60)}...` : user.bio}
          </p>
        )}
      </div>

      {showActions && (
        <div className="user-actions">
          <button className="action-btn message-btn" title="Send Message">
            
          </button>
          <button className="action-btn profile-btn" title="View Profile">
            
          </button>
        </div>
      )}

      <div className="user-meta">
        <small className="join-date">
          Joined {new Date(user.createdAt).toLocaleDateString()}
        </small>
      </div>
    </div>
  );

  return onClick ? (
    cardContent
  ) : (
    <Link to={`/users/${user.id}`} className="user-card-link">
      {cardContent}
    </Link>
  );
};

export default UserCard;