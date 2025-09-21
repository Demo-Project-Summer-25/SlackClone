import {
  Terminal,
  Folder,
  MessageCircle,
  User,
  Bell,
  Hash, // ✅ Add this
  Lock,
  Settings,
  Shield,
  LogOut,
  MessageSquare, // ✅ Add this
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DirectoryView } from "./DirectoryView";
import { ProfilePage } from "./ProfilePage";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth"; // ✅ Auth hook
import { useTheme } from "./ThemeProvider";

interface MainContentProps {
  activeTab: string;
  isInSplitMode?: boolean;
  activeDirectory?: {
    name: string;
    description: string;
    memberCount: number;
    isPrivate: boolean;
  } | null;
  onOpenDirectory?: (directory: {
    name: string;
    description: string;
    memberCount: number;
    isPrivate: boolean;
  }) => void;
  onCloseDirectory?: () => void;
  showProfilePage?: boolean;
  onOpenProfilePage?: () => void;
  onCloseProfilePage?: () => void;
  // ✅ Add navigation prop for switching tabs
  onNavigateToTab?: (tab: string) => void;
  // ✅ Add notification props
  notifications?: any[];
  onNotificationsChange?: () => void;
  onNotificationCountsChange?: (counts: NotificationCounts) => void;
}

// Add this interface near the top
interface NotificationCounts {
  total: number;
  directories: number; // channel notifications
  pings: number;      // DM notifications
}

// ✅ Move the types and exported function OUTSIDE the component
type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type NotificationContext = {
  label: string;
  icon: IconType;
};

// ✅ Move this function outside the component and remove 'export'
const getNotificationContextWithIcon = (notification: any): NotificationContext => {
  if (notification.directConversationId) {
    // DMs
    return { label: "Ping", icon: MessageSquare };
  } else if (notification.channelId) {
    // Channel posts
    return { label: "Channel", icon: Hash };
  }
  // General notifications
  return { label: "Notification", icon: Bell };
};

export function MainContent({
  activeTab,
  isInSplitMode = false,
  activeDirectory,
  onOpenDirectory,
  onCloseDirectory,
  showProfilePage,
  onOpenProfilePage,
  onCloseProfilePage,
  onNavigateToTab,
  notifications: propNotifications,
  onNotificationsChange,
  onNotificationCountsChange, // ✅ Add this
}: MainContentProps) {
  const { theme } = useTheme(); // ✅ Add theme hook
  const { currentUser, isLoading } = useAuth();
  const [directories, setDirectories] = useState<any[]>([]);
  
  // ✅ Use notifications from props if available, otherwise local state
  const [localNotifications, setLocalNotifications] = useState<any[]>([]);
  const notifications = propNotifications || localNotifications;

  // Move these functions INSIDE the component
  const handleNotificationClick = async (notification: any) => {
    // Mark notification as read first
    await markNotificationAsRead(notification.id);
    
    // Navigate to the appropriate tab
    if (notification.directConversationId) {
      // Navigate to Pings tab (DM notifications)
      onNavigateToTab?.('dms');
    } else if (notification.channelId) {
      // Navigate to Directories tab (channel notifications) 
      onNavigateToTab?.('directories');
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });
      // Use the appropriate notification refresh handler
      if (propNotifications) {
        onNotificationsChange?.();
      } else {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const fetchNotifications = () => {
    if (propNotifications) {
      // If notifications are passed as props, use the parent's handler
      onNotificationsChange?.();
      return;
    }
    
    // Original fetch logic for when MainContent manages its own notifications
    fetch("http://localhost:8080/api/notifications")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const mappedNotifications = Array.isArray(data) ? data.map(notif => ({
          id: notif.id,
          text: notif.text,
          message: notif.text,
          status: notif.status,
          type: notif.type,
          createdAt: notif.createdAt,
          readAt: notif.readAt,
          messageId: notif.messageId,
          directConversationId: notif.directConversationId,
          channelId: notif.channelId,
          unread: notif.status === 'UNREAD'
        })) : [];
        setLocalNotifications(mappedNotifications);
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
        setLocalNotifications([]);
      });
  };

  // Move helper functions inside component too
  const formatNotificationTitle = (notification: any) => {
    const text = notification.text || notification.message || '';
    const parts = text.split(':');
    return parts[0] || text;
  };

  const getMessagePreview = (notification: any) => {
    const text = notification.text || notification.message || '';
    const colonIndex = text.indexOf(':');
    return colonIndex !== -1 ? text.substring(colonIndex + 1).trim() : null;
  };

  // ✅ Update your existing getNotificationContext function
  const getNotificationContext = (notification: any) => {
    const context = getNotificationContextWithIcon(notification);
    return context.label; // Return just the label for backward compatibility
  };

  // ✅ Add new function to get the icon component
  const getNotificationIcon = (notification: any) => {
    const context = getNotificationContextWithIcon(notification);
    return context.icon;
  };

  const getNotificationInitials = (notification: any) => {
    const text = notification.text || notification.message || '';
    const firstWord = text.split(' ')[0];
    return firstWord.charAt(0).toUpperCase();
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Update the useEffect to use the new fetchNotifications function
  useEffect(() => {
    // Fetch directories
    fetch("http://localhost:8080/api/direct-conversations")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const mappedData = Array.isArray(data) ? data.map(conv => ({
          id: conv.id,
          name: conv.title || 'Direct Message',
          description: `${conv.participants?.length || 0} participants`,
          memberCount: conv.participants?.length || 0,
          isPrivate: !conv.isGroup
        })) : [];
        setDirectories(mappedData);
      })
      .catch((error) => { 
        console.error('Error fetching conversations:', error);
        setDirectories([]);
      });

    // Fetch notifications
    fetchNotifications();
  }, []);

  // If we're showing the full profile page
  if (showProfilePage && onCloseProfilePage) {
    return <ProfilePage onClose={onCloseProfilePage} />;
  }

  // If we're in a directory view
  if (activeDirectory && onCloseDirectory) {
    return <DirectoryView directory={activeDirectory} onBack={onCloseDirectory} />;
  }

  const renderTerminals = () => (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Channels</h2>
        <p className="text-muted-foreground">Team channels and discussions</p>
      </div>

      <div className="space-y-3">
        {/* Zip Code Channel - Active */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Hash className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Zip Code</h4>
                  <p className="text-xs text-muted-foreground">Main development channel</p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-500">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Mock Channel - Inactive */}
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center">
                  <Hash className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Mock Channel</h4>
                  <p className="text-xs text-muted-foreground">Test channel for development</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-gray-400">
                Inactive
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Fix the renderDirectories function to be more defensive
  const renderDirectories = () => {
    // Ensure directories is always an array
    const directoriesArray = Array.isArray(directories) ? directories : [];
    
    if (directoriesArray.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No directories found</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {directoriesArray.map((directory: any) => (
          <Card
            key={directory.id || directory.name}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onOpenDirectory?.(directory)}
          >
            {/* ...rest of your card content... */}
          </Card>
        ))}
      </div>
    );
  };

  const renderProfile = () => {
    if (isLoading) {
      return <div className="p-4">Loading...</div>;
    }
    if (!currentUser) {
      return <div className="p-4">No profile found</div>;
    }

    return (
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-2xl mb-2">Profile</h2>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Header */}
        <Card
          className="mb-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={onOpenProfilePage}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xl">
                  {currentUser.displayName?.[0] ||
                    currentUser.username[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg">
                  {currentUser.displayName || currentUser.username}
                </h3>
                <p className="text-muted-foreground">@{currentUser.username}</p>
                <Badge
                  variant={
                    currentUser.accountStatus === "ACTIVE"
                      ? "default"
                      : "destructive"
                  }
                  className="mt-2"
                >
                  {currentUser.accountStatus}
                </Badge>
              </div>
              <div className="text-muted-foreground">
                <span className="text-sm">Click to view profile</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Sections */}
        <div className="space-y-3">
          {[
            {
              icon: Settings,
              title: "Account Settings",
              description:
                "Update your personal information and account preferences",
              action: "Edit Profile",
            },
            {
              icon: Shield,
              title: "Privacy & Security",
              description: "Security settings and privacy controls",
              action: "Manage",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.action}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Logout Section */}
        <div className="mt-6">
          <Card className="border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Sign Out</h4>
                    <p className="text-xs text-muted-foreground">
                      Log out of your Ping account
                    </p>
                  </div>
                </div>
                <Button variant="destructive" size="sm">
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // ✅ Update the notification icons in the renderNotifications function
  const renderNotifications = () => (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-3xl mb-3">Notifications</h2>
        <p className="text-muted-foreground text-base">Stay updated with your team's activity</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notification, index) => {
          const isUnread = notification.status === 'UNREAD';
          const timeAgo = formatTimeAgo(notification.createdAt);
          const NotificationIcon = getNotificationIcon(notification);

          // Theme detection
          const isDarkMode =
            theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

          // Surfaces + text (no border utilities here)
          let cardClasses: string;
          let titleColor: string;
          let subtitleColor: string;
          let metaColor: string;

          if (isUnread) {
            // Unread → slightly stronger, same hover recipe as DMs
            cardClasses = isDarkMode
              ? 'bg-white/10 shadow-sm hover:shadow-md hover:bg-white/15 transition-colors transition-shadow'
              : 'bg-black/5 shadow-sm hover:shadow-md hover:bg-black/10 transition-colors transition-shadow';
            titleColor = 'text-foreground';
            subtitleColor = 'text-muted-foreground';
            metaColor = 'text-muted-foreground';
          } else {
            // Read → subtle, same hover recipe as DMs
            cardClasses = isDarkMode
              ? 'bg-card shadow-sm hover:shadow-md hover:bg-white/5 transition-colors transition-shadow'
              : 'bg-white shadow-sm hover:shadow-md hover:bg-black/5 transition-colors transition-shadow';
            titleColor = 'text-foreground';
            subtitleColor = 'text-muted-foreground';
            metaColor = 'text-muted-foreground';
          }

          // ✅ Avatar circle rule: dark mode → white bg + black icon; light mode → black bg + white icon
          const avatarBg = isDarkMode ? 'bg-white' : 'bg-black';
          const iconColor = isDarkMode ? 'text-black' : 'text-white';

          // Small unread cue
          const unreadDot = 'bg-blue-500';

          // ✅ Hairline border (alpha-toned & inline so it overrides stray CSS)
          const hairlineStyle: React.CSSProperties = {
            borderWidth: '0.7px',
            borderStyle: 'solid',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.4)',
          };

          return (
            <div
              key={notification.id || index}
              style={hairlineStyle}
              className={`
                p-4 rounded-lg cursor-pointer
                focus-within:shadow-md
                ${cardClasses}
                ${isUnread ? 'ring-2 ring-blue-500' : ''}
              `}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* ✅ Icon inside circle with forced contrast colors using inline styles */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: isDarkMode ? '#ffffff' : '#000000',
                    }}
                  >
                    {/* ✅ Use Lucide's color prop to force stroke color, bypassing CSS cascade */}
                    <NotificationIcon
                      className="w-4 h-4"
                      color={isDarkMode ? '#000000' : '#ffffff'}
                      strokeWidth={2} // Make lines slightly bolder for better readability
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <p className={`text-base font-medium ${titleColor}`}>
                      {formatNotificationTitle(notification)}
                    </p>

                    {/* Optional preview */}
                    {getMessagePreview(notification) && (
                      <p className={`text-base mt-1 line-clamp-2 ${subtitleColor}`}>
                        {getMessagePreview(notification)}
                      </p>
                    )}

                    {/* Meta row */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        {/* ✅ Small meta icon also with forced color */}
                        <NotificationIcon 
                          className={`w-3 h-3 ${metaColor}`}
                          color={isDarkMode ? '#9ca3af' : '#6b7280'}
                          strokeWidth={2}
                        />
                        <span className={`text-sm ${metaColor}`}>
                          {getNotificationContext(notification)}
                        </span>
                      </div>
                      <span className={`text-sm ${metaColor}`}>•</span>
                      <span className={`text-sm ${metaColor}`}>{timeAgo}</span>
                    </div>
                  </div>
                </div>

                {/* Unread indicator */}
                {isUnread && <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${unreadDot}`} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Add this function inside your MainContent component, after the other helper functions
  const calculateNotificationCounts = (): NotificationCounts => {
    const unreadNotifications = notifications.filter(n => n.status === 'UNREAD');

    return {
      total: unreadNotifications.length,
      directories: unreadNotifications.filter(n => n.channelId).length,
      pings: unreadNotifications.filter(n => n.directConversationId).length
    };
  };

  // Notify parent of count changes
  useEffect(() => {
    const counts = calculateNotificationCounts();
    onNotificationCountsChange?.(counts);
  }, [notifications]);

  // ✅ Default to notifications
  switch (activeTab) {
    case "directories":
      return renderDirectories();
    case "profile":
      return renderProfile();
    case "notifications":
      return renderNotifications();
    case "dms":
      return renderDirectories(); // or create a dedicated DMs view
    default:
      return renderNotifications();
  }
}
