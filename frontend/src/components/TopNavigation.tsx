import { useState } from "react";
import { Terminal, Folder, MessageCircle, Bell, Monitor, MonitorSpeaker, User, ChevronDown, Play, Square } from "lucide-react";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { useTheme } from "./ThemeProvider";

interface NotificationCounts {
  total: number;
  directories: number;
  pings: number;
}

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  splitScreenMode: boolean;
  onSplitScreenToggle: (enabled: boolean) => void;
  onTerminalSelect?: (terminal: { id: string; name: string; type: string; status: "Active" | "Inactive" }) => void;
  notificationCounts?: NotificationCounts;
}

export function TopNavigation({ 
  activeTab, 
  onTabChange, 
  splitScreenMode, 
  onSplitScreenToggle,
  onTerminalSelect,
  notificationCounts = { total: 0, directories: 0, pings: 0 }
}: TopNavigationProps) {
  const { theme } = useTheme();

  const terminals = [
    { id: "1", name: "Zip Code Wilmington", type:"10.1", status: "Active" as const },
    { id: "2", name: "ZipCorp LLC", type: "New Job", status: "Inactive" as const },
  ];
  
  const tabs = [
    { 
      id: "notifications", 
      label: "Notifications", 
      icon: Bell, 
      count: notificationCounts.total 
    },
    { 
      id: "directories", 
      label: "Directories", 
      icon: Folder, 
      count: notificationCounts.directories 
    },
    { 
      id: "dms", 
      label: "Pings", 
      icon: MessageCircle, 
      count: notificationCounts.pings 
    },
    { 
      id: "profile", 
      label: "Profile", 
      icon: User, 
      count: 0 
    },
  ];

  return (
    <div className="h-12 bg-card border-b border-border flex items-center px-2 sm:px-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-1">
          <div className="mr-2 sm:mr-6 flex items-center space-x-1 sm:space-x-2">
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
              <button className="relative flex items-center space-x-1 px-3 py-1.5 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/50">
                <Terminal className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Terminals</span>
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

          {/* Updated tabs with notification badges */}
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const hasNotifications = tab.count > 0;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors
                  ${isActive 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">{tab.label}</span>
                
                {/* Red notification badge */}
                {hasNotifications && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium border-2 border-background">
                    {tab.count > 99 ? '99+' : tab.count}
                  </div>
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