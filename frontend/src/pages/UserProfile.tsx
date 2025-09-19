import React from 'react';
import { useParams } from 'react-router-dom';
import UserProfile from '../components/users/UserProfile';
import { useAuth } from '../hooks/useAuth'; // Assuming you have auth context

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser } = useAuth(); // Get current user
  
  const profileUserId = userId || currentUser?.id;
  const isOwnProfile = !userId || userId === currentUser?.id;
  
  if (!profileUserId) {
    return <div>Please log in to view profiles</div>;
  }

  return (
    <UserProfile 
      userId={profileUserId} 
      isOwnProfile={isOwnProfile} 
    />
  );
};

export default UserProfilePage;