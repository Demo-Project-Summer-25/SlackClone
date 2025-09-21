import {
  Terminal,
  Folder,
  MessageCircle,
  User,
  Bell,
  Hash,
  Lock,
  Settings,
  Shield,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DirectoryView } from "./DirectoryView";
import { ProfilePage } from "./ProfilePage";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "./ThemeProvider";
import React from 'react';
import { ChannelService } from "../services/channelService";

// ✅ Clean interfaces
interface Directory {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
}

interface NotificationCounts {
  total: number;
  directories: number;
  pings: number;
}

interface MainContentProps {
  activeTab: string;
  isInSplitMode?: boolean;
  activeDirectory?: Directory | null;
  onOpenDirectory?: (directory: Directory) => void;
  onCloseDirectory?: () => void;
  showProfilePage?: boolean;
  onOpenProfilePage?: () => void;
  onCloseProfilePage?: () => void;
  onNavigateToTab?: (tab: string) => void;
  notifications?: any[];
  onNotificationsChange?: () => void;
  onNotificationCountsChange?: (counts: NotificationCounts) => void;
  directories?: any[];
  onDirectoriesChange?: (directories: any[]) => void;
}

// ✅ Helper types and functions (moved outside component)
type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type NotificationContext = {
  label: string;
  icon: IconType;
};

const getNotificationContextWithIcon = (notification: any): NotificationContext => {
  if (notification.directConversationId) {
    return { label: "Ping", icon: MessageSquare };
  } else if (notification.channelId) {
    return { label: "Channel", icon: Hash };
  }
  return { label: "Notification", icon: Bell };
};

type DirectoryItem = {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
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
  onNotificationCountsChange,
  directories: propDirectories = [],
  onDirectoriesChange,
}: MainContentProps) {
  const { theme } = useTheme();
  const { currentUser, isLoading } = useAuth();
  
  // ✅ State management
  const [localDirectories, setLocalDirectories] = useState<DirectoryItem[]>([]);
  const [localNotifications, setLocalNotifications] = useState<any[]>([]);
  const [dirsLoading, setDirsLoading] = useState(false);
  
  // ✅ Use props if available, otherwise local state
  const directories = propDirectories.length > 0 ? propDirectories : localDirectories;
  const notifications = propNotifications || localNotifications;

  // ✅ Notification handlers
  const handleNotificationClick = async (notification: any) => {
    await markNotificationAsRead(notification.id);
    
    if (notification.directConversationId) {
      onNavigateToTab?.('dms');
    } else if (notification.channelId) {
      onNavigateToTab?.('directories');
    }
  };


  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });
      
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
      onNotificationsChange?.();
      return;
    }
    
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

  // ✅ Helper functions
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

  const getNotificationContext = (notification: any) => {
    const context = getNotificationContextWithIcon(notification);
    return context.label;
  };

  const getNotificationIcon = (notification: any) => {
    const context = getNotificationContextWithIcon(notification);
    return context.icon;
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

  const calculateNotificationCounts = (): NotificationCounts => {
    const unreadNotifications = notifications.filter(n => n.status === 'UNREAD');

    return {
      total: unreadNotifications.length,
      directories: unreadNotifications.filter(n => n.channelId).length,
      pings: unreadNotifications.filter(n => n.directConversationId).length
    };
  };

  // ✅ Effects

  const handleSelectDirectory = (directoryId: string) => {
    const target = directories.find(d => d.id === directoryId);
    if (!target) return;
    onOpenDirectory?.({
      id: target.id,
      name: target.name,
      description: target.description,
      memberCount: 0,
      isPrivate: target.isPrivate,
    });
  };

  // ✅ Load channels for the signed-in user
  useEffect(() => {
    if (!currentUser?.id) return;

    let cancelled = false;
    setDirsLoading(true);

    const loadChannels = async () => {
      try {
        const channels = await ChannelService.getUserChannels(currentUser.id);
        console.log("Loaded channels:", channels); // Debug log
        const channelArray = Array.isArray(channels) ? channels : [];
        const mapped: DirectoryItem[] = channelArray.map((c: any) => ({
          id: c.id,
          name: c.name,
          description: c.description || "",
          isPrivate: typeof c.isPrivate === "boolean" ? c.isPrivate : !c.isPublic,
        }));
        
        if (!cancelled) {
          setLocalDirectories(mapped);
          if (onDirectoriesChange) {
            onDirectoriesChange(mapped);
          }
        }
      } catch (e) {
        console.error("Failed to fetch user channels", e);
        if (!cancelled) {
          setLocalDirectories([]);
          if (onDirectoriesChange) {
            onDirectoriesChange([]);
          }
        }
      } finally {
        if (!cancelled) setDirsLoading(false);
      }
    };

    loadChannels();
    return () => { cancelled = true; };
  }, [currentUser?.id, onDirectoriesChange]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const counts = calculateNotificationCounts();
    onNotificationCountsChange?.(counts);
  }, [notifications]);

  // ✅ Page renders
  if (activeDirectory && onCloseDirectory) {
    return (
      <DirectoryView
        directory={activeDirectory}
        onBack={onCloseDirectory}
        availableDirectories={directories}
        onSelectDirectory={handleSelectDirectory}
      />
    );
  }

  // ✅ Render functions
  const renderDirectories = () => {
    if (isLoading || dirsLoading) {
      return <div className="p-3 sm:p-4 lg:p-6 text-sm text-muted-foreground">Loading channels…</div>;
    }
    
    if (!currentUser) {
      return <div className="p-3 sm:p-4 lg:p-6 text-sm text-muted-foreground">No profile found</div>;
    }
    
    if (!directories.length) {
      return (
        <div className={`p-3 sm:p-4 lg:p-6 ${isInSplitMode ? 'max-w-4xl mx-auto' : ''}`}>
          <h2 className="text-xl sm:text-2xl lg:text-3xl mb-2">Directories</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">Project channels and discussions</p>
          <div className="text-sm sm:text-base text-muted-foreground">You're not in any channels yet.</div>
        </div>
      );
    }

    return (
      <div className={`p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 ${isInSplitMode ? 'max-w-4xl mx-auto' : ''}`}>
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl mb-2">Directories</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Project channels and discussions</p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {directories.map((d) => (
            <div
              key={d.id}

              className="flex items-center gap-3 p-3 sm:p-4 rounded-lg hover:bg-accent transition-colors cursor-pointer"
              onClick={() => onOpenDirectory?.(d)}

            >
              {/* ✅ Hash icon with theme-aware background circle - matching notification size */}
              <div className="relative w-6 h-6 sm:w-8 sm:h-8 shrink-0">
                {/* Background circle - white in dark mode, black in light mode */}
                <div className={`absolute inset-0 rounded-full ${
                  theme === 'dark' 
                    ? 'bg-white' 
                    : 'bg-black'
                }`} />
                {/* Hash icon - same size as notification icons */}
                <Hash 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4"
                  style={{
                    color: theme === 'dark' ? '#000000' : '#ffffff',
                    fill: theme === 'dark' ? '#000000' : '#ffffff'
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base lg:text-lg font-medium truncate">{d.name}</span>
                </div>
                {d.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground truncate mt-1">{d.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ✅ Update renderProfile in MainContent.tsx
  const renderProfile = () => {
    if (isLoading) return <div className="p-3 sm:p-4 lg:p-6">Loading...</div>;
    if (!currentUser) return <div className="p-3 sm:p-4 lg:p-6">No profile found</div>;

    // ✅ Show detailed profile page within the layout when showProfilePage is true
    if (showProfilePage) {
      return (
        <div className="h-full">
          <ProfilePage onClose={onCloseProfilePage} />
        </div>
      );
    }

    // ✅ Show profile summary (existing code)
    return (
      <div className={`p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 ${isInSplitMode ? 'max-w-4xl mx-auto' : ''}`}>
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl mb-2">Profile</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Card
          className="mb-4 sm:mb-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={onOpenProfilePage}
        >
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Responsive avatar */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground text-lg sm:text-xl lg:text-2xl font-medium">
                  {currentUser.displayName?.[0] || currentUser.username[0].toUpperCase()}
                </span>
              </div>
              
              {/* User info - flexible layout */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg lg:text-xl font-medium truncate">
                  {currentUser.displayName || currentUser.username}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground truncate">@{currentUser.username}</p>
                <Badge
                  variant={currentUser.accountStatus === "ACTIVE" ? "default" : "destructive"}
                  className="mt-2 text-xs sm:text-sm"
                >
                  {currentUser.accountStatus}
                </Badge>
              </div>
              
              {/* Action hint - hide on very small screens */}
              <div className="hidden sm:flex text-muted-foreground self-start sm:self-center">
                <span className="text-xs lg:text-sm">Click to view profile</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings grid - responsive layout */}
        <div className="grid gap-3 sm:gap-4 mb-4 sm:mb-6">
          {[
            {
              icon: Settings,
              title: "Account Settings",
              description: "Update your personal information and account preferences",
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
              <Card key={item.title} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-3 sm:p-4 lg:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Responsive icon */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm sm:text-base font-medium truncate">{item.title}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs sm:text-sm flex-shrink-0">
                      {item.action}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sign out section */}
        <div className="mt-4 sm:mt-6">
          <Card className="border-destructive/20">
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-destructive/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm sm:text-base font-medium">Sign Out</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Log out of your Ping account</p>
                  </div>
                </div>
                <Button variant="destructive" size="sm" className="flex-shrink-0">
                  <span className="hidden sm:inline">Log Out</span>
                  <span className="sm:hidden">Out</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // ✅ Update renderNotifications in MainContent.tsx  
  const renderNotifications = () => (
    <div className={`p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 ${isInSplitMode ? 'max-w-4xl mx-auto' : ''}`}>
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl mb-2">Notifications</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Stay updated with your team's activity</p>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {notifications.map((notification, index) => {
          const isUnread = notification.status === 'UNREAD';
          const timeAgo = formatTimeAgo(notification.createdAt);
          const NotificationIcon = getNotificationIcon(notification);

          return (
            <div
              key={notification.id || index}
              className={`
                flex items-start gap-3 p-3 sm:p-4 rounded-lg transition-colors cursor-pointer
                ${isUnread ? 'hover:bg-accent' : 'hover:bg-accent'}
              `}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <NotificationIcon className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium text-foreground line-clamp-2">
                  {formatNotificationTitle(notification)}
                </p>

                {getMessagePreview(notification) && (
                  <p className="text-sm sm:text-base mt-1 line-clamp-2 text-muted-foreground">
                    {getMessagePreview(notification)}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <NotificationIcon className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {getNotificationContext(notification)}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">•</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{timeAgo}</span>
                </div>
              </div>

              {isUnread && (
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-red-500" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ✅ Tab routing
  switch (activeTab) {
    case "directories":
      return renderDirectories();
    case "profile":
      return renderProfile();
    case "notifications":
      return renderNotifications();
    case "dms":
      return renderDirectories(); // You might want to create a dedicated DMs view
    default:
      return renderNotifications();
  }
}
