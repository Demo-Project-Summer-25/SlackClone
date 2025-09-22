import { useState, useEffect } from 'react';
import { TopNavigation } from "./components/TopNavigation";
import { DeveloperSidebar } from "./components/DeveloperSidebar";
import { MainContent } from "./components/MainContent";
import { DeveloperToolsContent } from "./components/DeveloperToolsContent";
import { ThemeProvider } from "./components/ThemeProvider";
import { Button } from "./components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./components/ui/resizable";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { 
  X, 
  Terminal, 
  Kanban,
  PanelLeftOpen
} from "lucide-react";
import React from 'react'; 
import { DmPage } from './pages/DmPage';
import { ProfilePage } from './components/ProfilePage';
import './styles/dm.css';
import ErrorBoundary from './components/ErrorBoundary';

interface NotificationCounts {
  total: number;
  directories: number;
  pings: number;
}

function AppContent() {
  // Default to directories tab
  const [activeTab, setActiveTab] = useState("directories");
  // Default to AI bot on the right
  const [activeTool, setActiveTool] = useState("ai");
  const [showDeveloperSidebar, setShowDeveloperSidebar] = useState(true);
  const [showMainContent, setShowMainContent] = useState(true);
  // Default to showing dev tools (AI bot) on the right
  const [showDevTools, setShowDevTools] = useState(true);
  // Default to split screen mode
  const [splitScreenMode, setSplitScreenMode] = useState(true);

  const [activeDirectory, setActiveDirectory] = useState<{
    id: string;
    name: string;
    description: string;
    memberCount: number;
    isPrivate: boolean;
  } | null>(null);

  const [showProfilePage, setShowProfilePage] = useState(false);

  // Add this state
  const [notificationCounts, setNotificationCounts] = useState<NotificationCounts>({
    total: 0,
    directories: 0,
    pings: 0
  });

  // ✅ Add notifications state to App level
  const [notifications, setNotifications] = useState<any[]>([]);

  // Handle split screen mode toggle
  const handleSplitScreenToggle = (enabled: boolean) => {
    setSplitScreenMode(enabled);
    
    if (enabled) {
      // When enabling split screen, show both panels
      setShowDevTools(true);
      setShowMainContent(true);
      setActiveTool("ai");
    }
    // When disabling split screen, keep current state but they'll be mutually exclusive
  };

  // Handle terminal selection - just show a toast notification for now
  const handleTerminalSelect = (terminal: { id: string; name: string; type: string; status: "Active" | "Inactive" }) => {
    toast(`Selected terminal: ${terminal.name} (${terminal.status})`);
  };

  // Handle tab changes - close DM conversations when switching tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Clear any active states when switching tabs
    if (tab !== "directories") {
      setActiveDirectory(null);
    }
    if (tab !== "profile") {
      setShowProfilePage(false);
    }
    
    // When changing tabs, show main content
    if (splitScreenMode) {
      // In split mode, show both
      setShowMainContent(true);
      setShowDevTools(true);
    } else {
      // In non-split mode, show main content and hide dev tools
      setShowMainContent(true);
      setShowDevTools(false);
    }
  };

  // Handle tool changes from developer sidebar
  const handleToolChange = (tool: string) => {
    setActiveTool(tool);
    
    if (splitScreenMode) {
      // In split mode, show both panels
      setShowMainContent(true);
      setShowDevTools(true);
    } else {
      // In non-split mode, show only dev tools when selecting a tool
      setShowMainContent(false);
      setShowDevTools(true);
    }
  };

  // Determine which panels are visible
  const bothPanelsVisible = splitScreenMode && showMainContent && showDevTools;
  const onlyMainVisible = showMainContent && (!showDevTools || !splitScreenMode);
  const onlyDevToolsVisible = !showMainContent && showDevTools;

  // Handle panel closing with split screen mode considerations
  const handleCloseMainContent = () => {
    if (splitScreenMode) {
      // In split mode, just hide main content
      setShowMainContent(false);
    } else {
      // In non-split mode, show dev tools when closing main content
      setShowMainContent(false);
      setShowDevTools(true);
    }
    setActiveDirectory(null);
    setShowProfilePage(false);
  };

  const handleCloseDevTools = () => {
    if (splitScreenMode) {
      // In split mode, just hide dev tools
      setShowDevTools(false);
    } else {
      // In non-split mode, show main content when closing dev tools
      setShowDevTools(false);
      setShowMainContent(true);
    }
  };

  // Use Alice's actual ID from import.sql
  const currentUserId = '68973614-94db-4f98-9729-0712e0c5c0fa';

  // ✅ Add function to fetch notifications at App level
  const fetchNotifications = () => {
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
        setNotifications(mappedNotifications);
        
        // ✅ Calculate and update notification counts
        const unreadNotifications = mappedNotifications.filter(n => n.status === 'UNREAD');
        setNotificationCounts({
          total: unreadNotifications.length,
          directories: unreadNotifications.filter(n => n.channelId).length,
          pings: unreadNotifications.filter(n => n.directConversationId).length
        });
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      });
  };

  // ✅ Fetch notifications on app load
  useEffect(() => {
    fetchNotifications();
    // Optionally set up polling for real-time updates
    const interval = setInterval(fetchNotifications, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Show toggle button on the RIGHT when sidebar is hidden */}
      {!showDeveloperSidebar && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeveloperSidebar(true)}
          className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </Button>
      )}

      <TopNavigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        splitScreenMode={splitScreenMode}
        onSplitScreenToggle={handleSplitScreenToggle}
        onTerminalSelect={handleTerminalSelect}
        notificationCounts={notificationCounts}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          {bothPanelsVisible ? (
            <ResizablePanelGroup direction="horizontal" className="flex-1">
              <ResizablePanel defaultSize={60} minSize={25}>
                <div className="h-full overflow-auto relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseMainContent}
                    className="absolute top-2 right-2 z-10 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  {activeTab === "dms" ? (
                    <DmPage 
                      currentUserId={currentUserId} 
                      notifications={notifications}
                      onNotificationsChange={fetchNotifications}
                    />
                  ) : (
                    <MainContent 
                      activeTab={activeTab} 
                      isInSplitMode={bothPanelsVisible}
                      activeDirectory={activeDirectory}
                      onOpenDirectory={setActiveDirectory}
                      onCloseDirectory={() => setActiveDirectory(null)}
                      showProfilePage={showProfilePage} // ✅ Pass the actual state
                      onOpenProfilePage={() => setShowProfilePage(true)}
                      onCloseProfilePage={() => setShowProfilePage(false)}
                      onNavigateToTab={setActiveTab}
                      notifications={notifications}
                      onNotificationsChange={fetchNotifications}
                      onNotificationCountsChange={setNotificationCounts}
                    />
                  )}
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={40} minSize={25}>
                <div className="h-full overflow-auto relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseDevTools}
                    className="absolute top-2 right-2 z-10 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <DeveloperToolsContent activeTool={activeTool} isInSplitMode={bothPanelsVisible} currentUserId={currentUserId} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : onlyMainVisible ? (
            <div className="flex-1 overflow-auto relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseMainContent}
                className="absolute top-2 right-2 z-10 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
              
              {activeTab === "dms" ? (
                <DmPage 
                  currentUserId={currentUserId}
                  notifications={notifications}
                  onNotificationsChange={fetchNotifications}
                />
              ) : (
                <MainContent 
                  activeTab={activeTab} 
                  isInSplitMode={false}
                  activeDirectory={activeDirectory}
                  onOpenDirectory={setActiveDirectory}
                  onCloseDirectory={() => setActiveDirectory(null)}
                  showProfilePage={showProfilePage} // ✅ Pass the actual state
                  onOpenProfilePage={() => setShowProfilePage(true)}
                  onCloseProfilePage={() => setShowProfilePage(false)}
                  onNavigateToTab={setActiveTab}
                  notifications={notifications}
                  onNotificationsChange={fetchNotifications}
                  onNotificationCountsChange={setNotificationCounts}
                />
              )}
            </div>
          ) : onlyDevToolsVisible ? (
            <div className="flex-1 overflow-auto relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseDevTools}
                className="absolute top-2 right-2 z-10 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
              <DeveloperToolsContent activeTool={activeTool} isInSplitMode={false} currentUserId={currentUserId} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No panels open</h3>
                <p className="text-muted-foreground mb-4">Select a tab or open a tool to get started</p>
                <div className="space-x-2">
                  <Button onClick={() => setShowMainContent(true)}>
                    Open Main Content
                  </Button>
                  <Button variant="outline" onClick={() => setShowDevTools(true)}>
                    Open Dev Tools
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Developer sidebar should always be visible when showDeveloperSidebar is true */}
        {showDeveloperSidebar && (
          <DeveloperSidebar 
            activeTool={activeTool}
            onToolChange={handleToolChange}
          />
        )}
      </div>
      
      <Toaster />
    </div>
  );
}

export default function App() {
  // ✅ CHANGED: Set default tab to notifications
  const [activeTab, setActiveTab] = useState('notifications');

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="ping-theme">
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
