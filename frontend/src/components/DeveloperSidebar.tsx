import { useState } from "react";
import { 
  Kanban, 
  Network, 
  Bot, 
  Calendar, 
  Code2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Circle
} from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useTheme } from "./ThemeProvider";

interface DeveloperSidebarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

export function DeveloperSidebar({ activeTool, onToolChange }: DeveloperSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userStatus, setUserStatus] = useState<"online" | "away" | "offline">("online");
  const { theme, setTheme } = useTheme();

  const tools = [
    { id: "kanban", label: "BackLog", icon: Kanban },
    { id: "uml", label: "WireFrame", icon: Network },
    { id: "ide", label: "IDE Sandbox", icon: Code2 },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "ai", label: "PingBot AI", icon: Bot },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-green-500";
      case "away": return "text-yellow-500";
      case "offline": return "text-gray-400";
      default: return "text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "online": return "Online";
      case "away": return "Away";
      case "offline": return "Offline";
      default: return "Online";
    }
  };



  return (
    <div className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
      isCollapsed ? "w-12" : "w-64"
    }`}>
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-sidebar-border flex items-center justify-between">
          {!isCollapsed && (
            <h3 className="text-sidebar-foreground">Dev Tools</h3>
          )}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-sidebar-foreground hover:bg-sidebar-accent w-6 h-6 p-0"
            >
              {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        <div className="flex-1 p-2">
          <TooltipProvider>
            <div className="space-y-1">
              {tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                
                const buttonContent = (
                  <Button
                    key={tool.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onToolChange(tool.id)}
                    className={`
                      w-full justify-start gap-3 h-9
                      ${isActive 
                        ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }
                      ${isCollapsed ? "justify-center px-0" : ""}
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span>{tool.label}</span>}
                  </Button>
                );

                if (isCollapsed) {
                  return (
                    <Tooltip key={tool.id}>
                      <TooltipTrigger asChild>
                        {buttonContent}
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>{tool.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return buttonContent;
              })}
            </div>
          </TooltipProvider>
        </div>
        
        {/* Theme Toggle and Status at Bottom */}
        <div className="p-2 mt-4 border-t border-sidebar-border space-y-1">
          <TooltipProvider>
            {/* Theme Toggle */}
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="w-full justify-center px-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-9"
                  >
                    {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{theme === "light" ? "Dark Mode" : "Light Mode"}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-9"
              >
                {theme === "light" ? <Moon className="w-5 h-5 flex-shrink-0" /> : <Sun className="w-5 h-5 flex-shrink-0" />}
                <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
              </Button>
            )}

            {/* Activity Status */}
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const statuses: ("online" | "away" | "offline")[] = ["online", "away", "offline"];
                      const currentIndex = statuses.indexOf(userStatus);
                      const nextIndex = (currentIndex + 1) % statuses.length;
                      setUserStatus(statuses[nextIndex]);
                    }}
                    className="w-full justify-center px-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-9"
                  >
                    <Circle className={`w-4 h-4 fill-current ${getStatusColor(userStatus)}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Click to change: {getStatusLabel(userStatus)}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const statuses: ("online" | "away" | "offline")[] = ["online", "away", "offline"];
                  const currentIndex = statuses.indexOf(userStatus);
                  const nextIndex = (currentIndex + 1) % statuses.length;
                  setUserStatus(statuses[nextIndex]);
                }}
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-9"
              >
                <Circle className={`w-4 h-4 flex-shrink-0 fill-current ${getStatusColor(userStatus)}`} />
                <span className="flex-1 text-left">{getStatusLabel(userStatus)}</span>
                <span className="text-xs text-muted-foreground">Click to change</span>
              </Button>
            )}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}