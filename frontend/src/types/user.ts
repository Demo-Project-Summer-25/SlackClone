export interface User {
  id: string;
  username: string;
  displayName?: string;
  profileUrl?: string;
  createdTimestamp: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  email?: string;
}

export interface UserUpdateRequest {
  displayName?: string;
  profileUrl?: string;
  email?: string;
}