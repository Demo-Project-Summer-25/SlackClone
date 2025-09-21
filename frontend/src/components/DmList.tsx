import React, { useEffect, useState } from 'react';
import { dmService } from '../services/dmService';
import { userService } from '../services/userService';
import { MessageService } from '../services/messageService';
import { DmResponse, MessageResponse } from '../types/api';
import { User } from '../types/user';
import { useTheme } from './ThemeProvider'; // ✅ Add theme import

interface DmListProps {
  currentUserId: string;
  onSelectDm: (dmId: string) => void;
  selectedDmId?: string;
  notifications?: any[];
  onNotificationsChange?: () => void;
}

export function DmList({ 
  currentUserId, 
  onSelectDm, 
  selectedDmId,
  notifications = [],
  onNotificationsChange
}: DmListProps) {
  const { theme } = useTheme(); // ✅ Add theme hook
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
        
        // ✅ Remove notifications fetch since we get them from props
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

  // ✅ Use notifications from props
  const getUnreadNotificationCount = (dmId: string): number => {
    return notifications.filter(notification => 
      notification.directConversationId === dmId && 
      notification.status === 'UNREAD'
    ).length;
  };

  // ✅ Add function to mark notifications as read when DM is opened
  const handleDmSelect = async (dmId: string) => {
    // Mark notifications for this DM as read
    const dmNotifications = notifications.filter(n => 
      n.directConversationId === dmId && n.status === 'UNREAD'
    );
    
    for (const notification of dmNotifications) {
      try {
        await fetch(`http://localhost:8080/api/notifications/${notification.id}/read`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    
    // Refresh notifications and select the DM
    onNotificationsChange?.();
    onSelectDm(dmId);
  };

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

// ✅ Update the return statement with toned hairline + subtle shadow
return (
  <div className="p-6">
    <h3 className="text-xl font-semibold mb-6 text-foreground">Direct Messages</h3>

    {dms.length === 0 ? (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-3">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <p className="text-muted-foreground text-lg">No conversations yet</p>
        <p className="text-base text-muted-foreground mt-2">Start a conversation with someone!</p>
      </div>
    ) : (
      <div className="space-y-3">
        {dms.map((dm) => {
          const otherUser = getOtherUser(dm);
          const unreadCount = getUnreadNotificationCount(dm.id);
          const hasUnreadMessages = unreadCount > 0;

          // Theme detect you already use
          const isDarkMode =
            theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

          // Neutral state styles (no border utilities here)
          let containerClasses: string;
          let titleColor: string;
          let timeColor: string;
          let messageColor: string;

          if (selectedDmId === dm.id) {
            containerClasses = isDarkMode
              ? 'bg-white/10 shadow hover:shadow hover:bg-white/15'
              : 'bg-black/5 shadow-sm hover:shadow-md hover:bg-black/10';
            titleColor = 'text-foreground';
            timeColor = 'text-muted-foreground';
            messageColor = 'text-foreground';
          } else if (hasUnreadMessages) {
            containerClasses = isDarkMode
              ? 'bg-white/5 shadow-sm hover:shadow-md hover:bg-white/10'
              : 'bg-black/5 shadow-sm hover:shadow-md hover:bg-black/10';
            titleColor = 'text-foreground';
            timeColor = 'text-muted-foreground';
            messageColor = 'text-foreground';
          } else {
            containerClasses = isDarkMode
              ? 'bg-card shadow-sm hover:shadow-md hover:bg-white/5'
              : 'bg-white shadow-sm hover:shadow-md hover:bg-black/5';
            titleColor = 'text-foreground';
            timeColor = 'text-muted-foreground';
            messageColor = 'text-muted-foreground';
          }

          // ✅ Softer hairline with alpha + gentle shadow
          const hairlineStyle: React.CSSProperties = {
            borderWidth: '0.7px',
            borderStyle: 'solid',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.4)',
            // Optional: crisp edges
            WebkitFontSmoothing: 'antialiased',
          };

          return (
            <div
              key={dm.id}
              style={hairlineStyle}
              className={`
                rounded-xl transition-all duration-200 overflow-hidden
                focus-within:shadow-md
                ${containerClasses}
              `}
            >
              <button
                onClick={() => handleDmSelect(dm.id)}
                className="w-full text-left p-4 transition-colors duration-150 focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar + badges */}
                  <div className="relative">
                    {dm.group ? (
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-base">
                          {getConversationInitials(dm)}
                        </span>
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold text-base">
                          {getConversationInitials(dm)}
                        </span>
                      </div>
                    )}

                    {hasUnreadMessages && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium border-2 border-background shadow-lg">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </div>
                    )}

                    {!dm.group && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background shadow-sm" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-semibold truncate text-base ${titleColor}`}>
                        {dm.group && <span className="text-muted-foreground mr-1">#</span>}
                        {getConversationName(dm)}
                      </h4>
                      <span className={`text-sm ml-3 flex-shrink-0 ${timeColor}`}>
                        {getLastMessageTime(dm)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <p className={`text-sm truncate ${messageColor}`}>{getMessagePreview(dm)}</p>

                      {selectedDmId === dm.id && !hasUnreadMessages && (
                        <div className="w-2 h-2 rounded-full flex-shrink-0 bg-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
}