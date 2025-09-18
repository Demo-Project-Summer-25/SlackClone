import { Terminal, Folder, MessageCircle, User, Bell, Hash, Lock, Users, Settings, Shield, Palette, Keyboard, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DirectMessageChat } from "./DirectMessageChat";
import { DirectoryView } from "./DirectoryView";
import { ProfilePage } from "./ProfilePage";
import { useEffect, useState } from "react";

interface MainContentProps {
  activeTab: string;
  isInSplitMode?: boolean;
  activeDM?: {
    name: string;
    status: "online" | "away" | "offline";
    lastMessage: string;
  } | null;
  onOpenDM?: (dm: { name: string; status: "online" | "away" | "offline"; lastMessage: string; }) => void;
  onCloseDM?: () => void;
  activeDirectory?: {
    name: string;
    description: string;
    memberCount: number;
    isPrivate: boolean;
  } | null;
  onOpenDirectory?: (directory: { name: string; description: string; memberCount: number; isPrivate: boolean; }) => void;
  onCloseDirectory?: () => void;
  activeTerminal?: {
    id: string;
    name: string;
    type: string;
    status: "running" | "stopped";
  } | null;
  onCloseTerminal?: () => void;
  showProfilePage?: boolean;
  onOpenProfilePage?: () => void;
  onCloseProfilePage?: () => void;
}

export function MainContent({
  activeTab,
  isInSplitMode = false,
  activeDM,
  onOpenDM,
  onCloseDM,
  activeDirectory,
  onOpenDirectory,
  onCloseDirectory,
  activeTerminal,
  onCloseTerminal,
  showProfilePage,
  onOpenProfilePage,
  onCloseProfilePage
}: MainContentProps) {
  // Backend data states
  const [directories, setDirectories] = useState<any[]>([]);
  const [dms, setDms] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Fetch directories
  useEffect(() => {
    fetch("/api/channels")
      .then(res => res.json())
      .then(setDirectories)
      .catch(() => { });
    fetch("/api/dms")
      .then(res => res.json())
      .then(setDms)
      .catch(() => { });
    fetch("/api/notifications")
      .then(res => res.json())
      .then(setNotifications)
      .catch(() => { });
  }, []);

  // If we're showing the profile page, show the profile interface
  if (showProfilePage && onCloseProfilePage) {
    return <ProfilePage onClose={onCloseProfilePage} />;
  }

  // If we're in a DM conversation, show the chat interface
  if (activeDM && onCloseDM) {
    return <DirectMessageChat contact={activeDM} onBack={onCloseDM} />;
  }

  // If we're in a directory, show the directory interface
  if (activeDirectory && onCloseDirectory) {
    return <DirectoryView directory={activeDirectory} onBack={onCloseDirectory} />;
  }

  // If we're in a terminal, show the terminal interface
  if (activeTerminal && onCloseTerminal) {
    return (
      <div className="flex flex-col h-full">
        {/* Terminal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onCloseTerminal}>
              ← Back to Terminals
            </Button>
            <div>
              <h2 className="font-medium">{activeTerminal.name}</h2>
              <p className="text-sm text-muted-foreground">{activeTerminal.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={activeTerminal.status === "running" ? "default" : "secondary"}>
              {activeTerminal.status}
            </Badge>
            <Button variant="outline" size="sm">
              {activeTerminal.status === "running" ? "Stop" : "Start"}
            </Button>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="flex-1 bg-black text-green-400 p-4 font-mono text-sm overflow-auto">
          <div className="space-y-1">
            <div>Welcome to {activeTerminal.name}</div>
            <div>Type: {activeTerminal.type}</div>
            <div>Status: {activeTerminal.status}</div>
            <div className="mt-4">
              <span className="text-blue-400">~/workspace $</span>
              <span className="animate-pulse ml-1">█</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const renderTerminals = () => (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Terminals</h2>
        <p className="text-muted-foreground">Quick access to your development environments</p>
      </div>

      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Terminal className="w-12 h-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-medium mb-2">Select a Terminal</h3>
            <p className="text-muted-foreground mb-4">
              Use the Terminals dropdown in the navigation bar to access your development environments.
            </p>
            <p className="text-sm text-muted-foreground">
              Click on "Terminals" above to see all available terminals and their status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDirectories = () => (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Directories</h2>
        <p className="text-muted-foreground">Project channels and discussions</p>
      </div>
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
    </div>
  );

  const renderDMs = () => (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Pings</h2>
        <p className="text-muted-foreground">Private conversations with team members</p>
      </div>
      <div className="space-y-2">
        {dms.map((dm) => (
          <div
            key={dm.id || dm.name}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
            onClick={() => onOpenDM?.(dm)}
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xs sm:text-sm">
                  {dm.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${dm.status === "online" ? "bg-green-500" :
                  dm.status === "away" ? "bg-yellow-500" : "bg-gray-400"
                }`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm truncate">{dm.name}</span>
                {dm.unread > 0 && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0 shrink-0">
                    {dm.unread}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{dm.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
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
    </div>
  );

  switch (activeTab) {
    case "terminals":
      return renderTerminals();
    case "directories":
      return renderDirectories();
    case "dms":
      return renderDMs();
    case "profile":
      return renderProfile();
    case "notifications":
      return renderNotifications();
    default:
      return renderTerminals();
  }
}