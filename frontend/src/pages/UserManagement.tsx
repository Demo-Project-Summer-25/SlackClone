import React from 'react';
import { useUsers } from '../hooks/useUsers';
import UserList from '../components/users/UserList';
import UserSearch from '../components/users/UserSearch';

const UserManagement: React.FC = () => {
  const { users, loading, error } = useUsers();

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-management">
      <h1>User Management</h1>
      <UserSearch />
      <UserList users={users} />
    </div>
  );
};

export default UserManagement;