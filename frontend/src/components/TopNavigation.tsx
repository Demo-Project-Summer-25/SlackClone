import { useState } from "react";
import { Terminal, Folder, MessageCircle, User, Bell } from "lucide-react";
import { Badge } from "./ui/badge";
import { useTheme } from "./ThemeProvider";

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TopNavigation({ 
  activeTab, 
  onTabChange
}: TopNavigationProps) {
  const { theme } = useTheme();
  
  // Mock notification data
  const [notifications, setNotifications] = useState({
    notifications: 3,
    directories: 0,
    dms: 2,
    profile: 0,
  });

  const tabs = [
    { id: "channels", label: "Terminals", icon: Terminal },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "directories", label: "Directories", icon: Folder },
    { id: "dms", label: "Pings", icon: MessageCircle },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="h-12 bg-card border-b border-border flex items-center px-2 sm:px-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <div className="mr-3 sm:mr-4 flex items-center space-x-2 sm:space-x-2">
            <img
              src={theme === "dark" ? "/Pinglogowhite.png" : "/Pinglogoblack.png"}
              alt="Ping Logo"
              className="w-18 h-8 object-contain"
              style={{ display: "block" }}
            />
          </div>

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const notificationCount = notifications[tab.id as keyof typeof notifications] || 0;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors
                  ${isActive 
                    ? "bg-accent text-accent-foreground" 
                    : "text-gray-300 hover:text-white hover:bg-accent/50"
                  }
                  ${tab.id === "notifications" ? "-ml-2" : ""}
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-black tracking-tight hidden sm:inline">{tab.label}</span>
                {notificationCount > 0 && (
                  <Badge 
                    variant="outline" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center bg-white text-red-600 border-black"
                  >
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}