import { Terminal, Folder, MessageCircle, User, Bell, Hash, Lock, Users, Settings, Shield, Palette, Keyboard, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DirectoryView } from "./DirectoryView";
import { ProfilePage } from "./ProfilePage";
import { useEffect, useState } from "react";

interface MainContentProps {
  activeTab: string;
  isInSplitMode?: boolean;
  activeDirectory?: {
    name: string;
    description: string;
    memberCount: number;
    isPrivate: boolean;
  } | null;
  onOpenDirectory?: (directory: { name: string; description: string; memberCount: number; isPrivate: boolean; }) => void;
  onCloseDirectory?: () => void;
  showProfilePage?: boolean;
  onOpenProfilePage?: () => void;
  onCloseProfilePage?: () => void;
}

export function MainContent({
  activeTab,
  isInSplitMode = false,
  activeDirectory,
  onOpenDirectory,
  onCloseDirectory,
  showProfilePage,
  onOpenProfilePage,
  onCloseProfilePage
}: MainContentProps) {
  // Backend data states
  const [directories, setDirectories] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Fetch directories and notifications
  useEffect(() => {
    fetch("/api/channels")
      .then(res => res.json())
      .then(setDirectories)
      .catch(() => { 
        // No mock data - just empty array
        setDirectories([]);
      });
    
    fetch("/api/notifications")
      .then(res => res.json())
      .then(setNotifications)
      .catch(() => {
        // No mock notifications - just empty array
        setNotifications([]);
      });
  }, []);

  // If we're showing the profile page, show the profile interface
  if (showProfilePage && onCloseProfilePage) {
    return <ProfilePage onClose={onCloseProfilePage} />;
  }

  // If we're in a directory, show the directory interface
  if (activeDirectory && onCloseDirectory) {
    return <DirectoryView directory={activeDirectory} onBack={onCloseDirectory} />;
  }

  const renderDirectories = () => (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Directories</h2>
        <p className="text-muted-foreground">Project channels and discussions</p>
      </div>
      
      {directories.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <Folder className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No directories
          </h3>
          <p className="text-gray-500">
            No project channels available yet. Check back later or contact your admin.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {directories.map((directory) => (
            <div
              key={directory.id || directory.name}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
              onClick={() => onOpenDirectory?.({
                name: directory.name,
                description: directory.description,
                memberCount: directory.memberCount,
                isPrivate: directory.isPrivate
              })}
            >
              {directory.isPrivate ? (
                <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
              ) : (
                <Hash className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm truncate">{directory.name}</span>
                  {directory.unread > 0 && (
                    <Badge variant="destructive" className="text-xs px-1.5 py-0 shrink-0">
                      {directory.unread}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{directory.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Profile</h2>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Header */}
      <Card className="mb-6 cursor-pointer hover:shadow-md transition-shadow" onClick={onOpenProfilePage}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-xl">JD</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg">Mock Name</h3>
              <p className="text-muted-foreground">Mock@ping.dev</p>
              <Badge variant="outline" className="mt-2">Junior Developer</Badge>
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
            description: "Update your personal information and account preferences",
            action: "Edit Profile"
          },
          {
            icon: Shield,
            title: "Privacy & Security",
            description: "Security settings and privacy controls",
            action: "Manage"
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">{item.action}</Badge>
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
                  <p className="text-xs text-muted-foreground">Log out of your Ping account</p>
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

  const renderNotifications = () => (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Notifications</h2>
        <p className="text-muted-foreground">Stay updated with your team's activity</p>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <Bell className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notifications
          </h3>
          <p className="text-gray-500">
            You're all caught up! Check back later for new updates.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <div
              key={notification.id || index}
              className={`p-3 rounded-lg border transition-colors ${notification.unread ? "bg-accent/50 border-accent" : "bg-card border-border"
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
                {notification.unread && (
                  <div className="w-2 h-2 bg-primary rounded-full mt-1 shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  switch (activeTab) {
    case "directories":
      return renderDirectories();
    case "profile":
      return renderProfile();
    case "notifications":
      return renderNotifications();
    default:
      return renderDirectories();
  }
}