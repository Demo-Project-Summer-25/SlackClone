import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types/user';

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <div className="user-list">
      <div className="user-list-header">
        <span>Name</span>
        <span>Email</span>
        <span>Status</span>
        <span>Joined</span>
      </div>
      
      {users.map(user => (
        <Link 
          key={user.id} 
          to={`/users/${user.id}`} 
          className="user-list-item"
        >
          <div className="user-info">
            <img 
              src={user.profilePictureUrl || '/default-avatar.png'} 
              alt={user.username}
              className="user-avatar-small"
            />
            <div>
              <strong>{user.displayName || user.username}</strong>
              <span className="username">@{user.username}</span>
            </div>
          </div>
          
          <span className="user-email">{user.email}</span>
          
          <span className={`status-indicator ${user.status?.toLowerCase()}`}>
            {user.status}
          </span>
          
          <span className="join-date">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default UserList;