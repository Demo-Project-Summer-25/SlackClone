// frontend/src/components/MainContent.tsx
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
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DirectoryView } from "./DirectoryView";
import { ProfilePage } from "./ProfilePage";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth"; // ✅ Auth hook
import React from 'react';

interface Directory {
  id: string;
  name: string;
  // Add other properties as needed
}

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
  directories?: Directory[]; // Make it optional with default
}

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
}: MainContentProps) {
  const { currentUser, isLoading } = useAuth(); // ✅ real user
  const [notifications, setNotifications] = useState<any[]>([]);

  // Fetch notifications
  useEffect(() => {
    fetch("/api/channels")
      .then((res) => res.json())
      .then(setDirectories)
      .catch(() => { 
        // No mock data - just empty array
        setDirectories([]);
      });

    fetch("/api/notifications")
      .then((res) => res.json())
      .then(setNotifications)
      .catch(() => {
        // No mock notifications - just empty array
        setNotifications([]);
      });
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
            className={`p-3 rounded-lg border transition-colors ${
              notification.unread
                ? "bg-accent/50 border-accent"
                : "bg-card border-border"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.time}
                </p>
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
      return renderDirectories(); // Default to directories instead of terminals
  }
}
