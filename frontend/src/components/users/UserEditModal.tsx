import React, { useState } from 'react';
import { User, UserUpdateRequest } from '../../types/user';

interface UserEditModalProps {
  user: User;
  onUpdate: (request: UserUpdateRequest) => Promise<User | undefined>;
  onClose: () => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ user, onUpdate, onClose }) => {
  const [formData, setFormData] = useState<UserUpdateRequest>({
    username: user.username,
    email: user.email,
    displayName: user.displayName || '',
    profilePictureUrl: user.profilePictureUrl || '',
    status: user.status || 'ONLINE',
    bio: user.bio || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="How others see your name"
            />
          </div>

          <div className="form-group">
            <label>Profile Picture URL</label>
            <input
              type="url"
              value={formData.profilePictureUrl}
              onChange={(e) => setFormData({ ...formData, profilePictureUrl: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="ONLINE"> Online</option>
              <option value="AWAY"> Away</option>
              <option value="BUSY"> Busy</option>
              <option value="OFFLINE"> Offline</option>
            </select>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell others about yourself..."
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;