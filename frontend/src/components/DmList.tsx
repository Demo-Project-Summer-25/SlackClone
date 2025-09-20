import React, { useEffect, useState } from 'react';
import { dmService } from '../services/dmService';
import { userService } from '../services/userService';
import { MessageService } from '../services/messageService';
import { DmResponse, MessageResponse } from '../types/api';
import { User } from '../types/user';

interface DmListProps {
  currentUserId: string;
  onSelectDm: (dmId: string) => void;
  selectedDmId?: string;
}

export function DmList({ currentUserId, onSelectDm, selectedDmId }: DmListProps) {
  const [dms, setDms] = useState<DmResponse[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [lastMessages, setLastMessages] = useState<Record<string, MessageResponse>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [dmsData, usersData] = await Promise.all([
          dmService.getDmsForUser(currentUserId),
          userService.getAllUsers()
        ]);
        
        setDms(dmsData);
        setUsers(usersData);

        // Load last message for each DM conversation
        const messagePromises = dmsData.map(async (dm) => {
          try {
            const messages = await MessageService.getDmMessages(dm.id, { limit: 1 });
            return { dmId: dm.id, lastMessage: messages[0] || null };
          } catch (err) {
            console.warn(`Failed to load messages for DM ${dm.id}:`, err);
            return { dmId: dm.id, lastMessage: null };
          }
        });

        const messageResults = await Promise.all(messagePromises);
        const messagesMap: Record<string, MessageResponse> = {};
        messageResults.forEach(({ dmId, lastMessage }) => {
          if (lastMessage) {
            messagesMap[dmId] = lastMessage;
          }
        });
        setLastMessages(messagesMap);
        
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
    
    const otherParticipant = dm.participants.find(p => p.userId !== currentUserId);
    if (otherParticipant) {
      const user = getUserById(otherParticipant.userId);
      return user?.displayName || user?.username || 'Unknown User';
    }
    
    return 'Direct Message';
  };

  // ✅ Get the other user for profile picture
  const getOtherUser = (dm: DmResponse) => {
    if (dm.group) return null;
    const otherParticipant = dm.participants.find(p => p.userId !== currentUserId);
    return otherParticipant ? getUserById(otherParticipant.userId) : null;
  };

  const getConversationInitials = (dm: DmResponse) => {
    const name = getConversationName(dm);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getMessagePreview = (dm: DmResponse): string => {
    const lastMessage = lastMessages[dm.id];
    if (!lastMessage) {
      return 'No messages yet';
    }

    const senderName = lastMessage.senderUserId === currentUserId 
      ? 'You' 
      : getUserById(lastMessage.senderUserId)?.displayName || 'Someone';
    
    const preview = lastMessage.content.length > 30 
      ? `${lastMessage.content.substring(0, 30)}...` 
      : lastMessage.content;
    
    return `${senderName}: ${preview}`;
  };

  const getLastMessageTime = (dm: DmResponse): string => {
    const lastMessage = lastMessages[dm.id];
    if (!lastMessage) {
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
    }

    const date = new Date(lastMessage.createdAt);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-40"></div>
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500 text-center">
          <p className="mb-3 text-base">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Direct Messages</h3>
      
      {dms.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-3">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No conversations yet</p>
          <p className="text-base text-gray-400 mt-2">Start a conversation with someone!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {dms.map((dm) => {
            const otherUser = getOtherUser(dm); // ✅ Get the actual user data
            
            return (
              <button
                key={dm.id}
                onClick={() => onSelectDm(dm.id)}
                className={`w-full text-left p-4 rounded-lg transition-colors duration-150 hover:bg-gray-100 ${
                  selectedDmId === dm.id ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* ✅ Avatar - Use same style as chat header but show actual profile pictures */}
                  <div className="relative">
                    {dm.group ? (
                      // Group avatar - keep existing gradient style
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-base">
                          {getConversationInitials(dm)}
                        </span>
                      </div>
                    ) : (
                      // ✅ Individual user avatar - same style as in chat header
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold text-base">
                          {getConversationInitials(dm)}
                        </span>
                      </div>
                    )}
                    
                    {/* Online status indicator - same as chat header */}
                    {!dm.group && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 truncate text-base">
                        {dm.group && <span className="text-gray-500 mr-1">#</span>}
                        {getConversationName(dm)}
                      </h4>
                      <span className="text-sm text-gray-500 ml-3 flex-shrink-0">
                        {getLastMessageTime(dm)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-gray-600 truncate">
                        {getMessagePreview(dm)}
                      </p>
                      
                      {selectedDmId === dm.id && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}