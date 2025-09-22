import React, { useEffect, useState } from 'react';
import { DmService } from '../services/dmService';
import { UserService } from '../services/userService';
import { DmResponse } from '../types/api';
import { User } from '../types/user';

interface DmListProps {
  currentUserId: string;
  onSelectDm: (dmId: string) => void;
  selectedDmId?: string;
}

export function DmList({ currentUserId, onSelectDm, selectedDmId }: DmListProps) {
  const [dms, setDms] = useState<DmResponse[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load both DMs and users in parallel
        const [dmsData, usersData] = await Promise.all([
          DmService.getDmsForUser(currentUserId),
          UserService.getAllUsers()
        ]);
        
        setDms(dmsData);
        setUsers(usersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conversations');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUserId]);

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const getConversationName = (dm: DmResponse) => {
    if (dm.group && dm.title) {
      return dm.title;
    }
    
    // Find the other participant (not the current user)
    const otherParticipant = dm.participants.find(p => p.userId !== currentUserId);
    if (otherParticipant) {
      const user = getUserById(otherParticipant.userId);
      return user?.displayName || user?.username || 'Unknown User';
    }
    
    return 'Direct Message';
  };

  const getConversationInitials = (dm: DmResponse) => {
    const name = getConversationName(dm);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getLastActivity = (dm: DmResponse): string => {
    const date = new Date(dm.createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-2 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 text-center">
          <p className="mb-2">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Direct Messages</h3>
      
      {dms.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500">No conversations yet</p>
          <p className="text-sm text-gray-400 mt-1">Start a conversation with someone!</p>
        </div>
      ) : (
        <div className="space-y-1">
          {dms.map((dm) => (
            <button
              key={dm.id}
              onClick={() => onSelectDm(dm.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors duration-150 hover:bg-gray-100 ${
                selectedDmId === dm.id ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {getConversationInitials(dm)}
                    </span>
                  </div>
                  {!dm.group && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 truncate">
                      {dm.group && <span className="text-gray-500 mr-1">#</span>}
                      {getConversationName(dm)}
                    </h4>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {getLastActivity(dm)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500 truncate">
                      {dm.group 
                        ? `${dm.participants.filter(p => !p.leftAt).length} members`
                        : 'Direct message'
                      }
                    </p>
                    
                    {selectedDmId === dm.id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}