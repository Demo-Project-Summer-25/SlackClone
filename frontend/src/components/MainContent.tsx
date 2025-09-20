// frontend/src/components/MainContent.tsx
import {
  Hash,
  Lock,
  Settings,
  Shield,
  LogOut,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DirectoryView } from "./DirectoryView";
import { ProfilePage } from "./ProfilePage";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth"; // ✅ Auth hook
import React from 'react';
import { channelService } from "../services/channelService";

interface Directory {
  id: string;
  name: string;
  // Add other properties as needed
}


interface MainContentProps {
  activeTab: string;
  isInSplitMode?: boolean;
  activeDirectory?: {
    id: string; // ✅ added
    name: string;
    description: string;
    memberCount: number;
    isPrivate: boolean;
  } | null;
  onOpenDirectory?: (directory: {
    id: string; // ✅ added
    name: string;
    description: string;
    memberCount: number;
    isPrivate: boolean;
  }) => void;
  onCloseDirectory?: () => void;
  showProfilePage?: boolean;
  onOpenProfilePage?: () => void;
  onCloseProfilePage?: () => void;
  directories?: any[];
  onDirectoriesChange?: (directories: any[]) => void; // Add this prop
}

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
  directories = [],
  onDirectoriesChange,
}: MainContentProps) {

  const { currentUser, isLoading } = useAuth(); // ✅ real user
  const [notifications, setNotifications] = useState<any[]>([]);

  // Fetch notifications
  useEffect(() => {
    fetch("/api/channels")
      .then((res) => res.json())
      .then((dirs) => {
        if (onDirectoriesChange) {
          onDirectoriesChange(dirs);
        }
      })
      .catch(() => { 
        if (onDirectoriesChange) {
          onDirectoriesChange([]);
        }
      });

    fetch("/api/notifications")
      .then((res) => res.json())
      .then(setNotifications)
      .catch(() => {
        // No mock notifications - just empty array
        setNotifications([]);
      });
  }, [onDirectoriesChange]);


    const load = async () => {
      setDirsLoading(true);
      try {
        const channels = await channelService.getUserChannels(currentUser.id);
        const mapped: DirectoryItem[] = (channels || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          description: c.description || "",
          isPrivate:
            typeof c.isPrivate === "boolean"
              ? c.isPrivate
              : typeof c.isPublic === "boolean"
              ? !c.isPublic
              : true,
        }));
        if (!cancelled) setDirectories(mapped);
      } catch (e) {
        console.error("Failed to fetch user channels", e);
        if (!cancelled) setDirectories([]);
      } finally {
        if (!cancelled) setDirsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  // Notifications (safe to ignore failures)
  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) =>
        setNotifications(
          Array.isArray(data)
            ? data.map((n: any) => ({
                id: n.id,
                message: n.text || "New notification",
                time: n.createdAt ? new Date(n.createdAt).toLocaleString() : "",
                unread: n.isRead === false,
              }))
            : []
        )
      )
      .catch(() => setNotifications([]));
  }, []);

  // ✅ Full Profile Page
  if (showProfilePage && onCloseProfilePage) {
    return <ProfilePage onClose={onCloseProfilePage} />;
  }

  // ✅ Directory View
  if (activeDirectory && onCloseDirectory) {
    return <DirectoryView directory={activeDirectory} onBack={onCloseDirectory} />;
  }

  // ✅ Directories (channels) list
  const renderDirectories = () => {
    if (isLoading || dirsLoading) {
      return <div className="p-6 text-sm text-muted-foreground">Loading channels…</div>;
    }
    if (!currentUser) {
      return <div className="p-6 text-sm text-muted-foreground">No profile found</div>;
    }
    if (!directories.length) {
      return (
        <div className="p-6">
          <h2 className="text-2xl mb-2">Directories</h2>
          <p className="text-muted-foreground mb-4">Project channels and discussions</p>
          <div className="text-sm text-muted-foreground">You’re not in any channels yet.</div>
        </div>
      );
    }

    return (
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-2xl mb-2">Directories</h2>
          <p className="text-muted-foreground">Project channels and discussions</p>
        </div>

        <div className="space-y-2">
          {directories.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
              onClick={() =>
                onOpenDirectory?.({
                  id: d.id,
                  name: d.name,
                  description: d.description,
                  memberCount: 0,
                  isPrivate: d.isPrivate,
                })
              }
            >
              {d.isPrivate ? (
                <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
              ) : (
                <Hash className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm truncate">{d.name}</span>
                </div>
                {d.description && (
                  <p className="text-xs text-muted-foreground truncate">{d.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ✅ Profile summary (clickable to full profile)
  const renderProfile = () => {
    if (isLoading) return <div className="p-4">Loading...</div>;
    if (!currentUser) return <div className="p-4">No profile found</div>;

    return (
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-2xl mb-2">Profile</h2>
          <p className="text-muted-foreground">Manage your account and preferences</p>
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
                    currentUser.accountStatus === "ACTIVE" ? "default" : "destructive"
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

        {/* Extra sections */}
        <div className="space-y-3">
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
                    <p className="text-xs text-muted-foreground">Log out of your Ping account</p>
                  </div>
                </div>
                <Button variant="destructive" size="sm">Log Out</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // ✅ Notifications
  const renderNotifications = () => (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Notifications</h2>
        <p className="text-muted-foreground">Stay updated with your team's activity</p>
      </div>

      <div className="space-y-3">
        {notifications.map((n, index) => (
          <div
            key={n.id || index}
            className={`p-3 rounded-lg border transition-colors ${
              n.unread ? "bg-accent/50 border-accent" : "bg-card border-border"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
              {n.unread && <div className="w-2 h-2 bg-primary rounded-full mt-1 shrink-0" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Add safety check
  const safeDirectories = Array.isArray(directories) ? directories : [];


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
