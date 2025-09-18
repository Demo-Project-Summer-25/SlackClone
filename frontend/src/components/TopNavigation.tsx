import { useState } from "react";
import { Terminal, Folder, MessageCircle, Bell, Monitor, MonitorSpeaker, User, ChevronDown, Play, Square } from "lucide-react";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { useTheme } from "./ThemeProvider";

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  splitScreenMode: boolean;
  onSplitScreenToggle: (enabled: boolean) => void;
  onTerminalSelect?: (terminal: { id: string; name: string; type: string; status: "Active" | "Inactive" }) => void;
}

export function TopNavigation({ 
  activeTab, 
  onTabChange, 
  splitScreenMode, 
  onSplitScreenToggle,
  onTerminalSelect
}: TopNavigationProps) {
  const { theme } = useTheme();

  // Mock notification data - in a real app this would come from props or state management
  const notifications = {
    directories: 3, // 3 unread directory messages
    dms: 1, // 1 unread DM
    notifications: 5, // 5 total notifications
  };

  // Mock terminals data
  const terminals = [
    { id: "1", name: "ZipCode Wilmington", type: "11.1", status: "Active" as const },
    { id: "2", name: "Mock", type: "Mock", status: "Inactive" as const },
  ];
  
  const tabs = [
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
        
          {/* Terminals Dropdown */}
          <DropdownMenu>
<DropdownMenuTrigger asChild>
  <button
    className={`
      relative flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors
      text-gray-300 hover:text-white hover:bg-accent/50
    `}
  >
    <Terminal className="w-4 h-4" />
    <span className="text-sm font-black tracking-tight hidden sm:inline">Terminals</span>
    <ChevronDown className="w-3 h-3" />
  </button>
</DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">Active Terminals</p>
              </div>
              <DropdownMenuSeparator />
              {terminals.map((terminal) => (
                <DropdownMenuItem
                  key={terminal.id}
                  onClick={() => onTerminalSelect?.(terminal)}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center gap-2 flex-1">
                    {terminal.status === "Active" ? (
                      <Play className="w-3 h-3 text-green-500 fill-current" />
                    ) : (
                      <Square className="w-3 h-3 text-yellow-500" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm">{terminal.name}</span>
                      <span className="text-xs text-muted-foreground">{terminal.type}</span>
                    </div>
                  </div>
                  <Badge variant={terminal.status === "Active" ? "default" : "secondary"} className="text-xs">
                    {terminal.status}
                  </Badge>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Terminal className="w-4 h-4 mr-2" />
                New Terminal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
        
        {/* Split Screen Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {splitScreenMode ? (
              <MonitorSpeaker className="w-4 h-4" />
            ) : (
              <Monitor className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Split Screen</span>
            <Switch 
              checked={splitScreenMode} 
              onCheckedChange={onSplitScreenToggle}
              aria-label="Toggle split screen mode"
            />
          </div>
        </div>
      </div>
    </div>
  );
}