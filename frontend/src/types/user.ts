export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  profilePictureUrl?: string;
  status?: 'ONLINE' | 'AWAY' | 'BUSY' | 'OFFLINE';
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  displayName?: string;
  profilePictureUrl?: string;
  status?: 'ONLINE' | 'AWAY' | 'BUSY' | 'OFFLINE';
  bio?: string;
}