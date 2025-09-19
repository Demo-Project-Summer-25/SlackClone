// frontend/src/components/ProfilePage.tsx
import { useState, useEffect } from "react";
import { UserService } from "../services/userService";
import { User } from "../types/user";
import { Badge } from "../components/ui/badge";

interface ProfilePageProps {
  onClose: () => void;
}

export function ProfilePage({ onClose }: ProfilePageProps) {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const users = await UserService.getAllUsers();
        if (users.length > 0) {
          setProfile(users[0]);
        }
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!profile) return <div className="p-4">No profile found</div>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <button 
        onClick={onClose}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button>
      
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-xl font-bold">
            {profile.displayName?.[0] || profile.username[0].toUpperCase()}
          </span>
        </div>
        
        <h2 className="text-xl font-semibold">{profile.displayName || profile.username}</h2>
        <p className="text-gray-600">@{profile.username}</p>
        
        <div className="mt-4">
          <Badge variant={profile.accountStatus === 'ACTIVE' ? 'default' : 'destructive'}>
            {profile.accountStatus}
          </Badge>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          Member since {new Date(profile.createdTimestamp).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}