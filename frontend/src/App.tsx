import { useState } from 'react';
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
import './styles/dm.css';

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
    name: string;
    description: string;
    memberCount: number;
    isPrivate: boolean;
  } | null>(null);

  const [showProfilePage, setShowProfilePage] = useState(false);

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
  const handleTerminalSelect = (terminal: { id: string; name: string; type: string; status: "running" | "paused" }) => {
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
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main content area - now comes FIRST (left side) */}
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
                  
                  {/* Show DM Page when dms tab is active */}
                  {activeTab === "dms" ? (
                    <DmPage currentUserId={currentUserId} />
                  ) : (
                    <MainContent 
                      activeTab={activeTab} 
                      isInSplitMode={bothPanelsVisible}
                      activeDirectory={activeDirectory}
                      onOpenDirectory={setActiveDirectory}
                      onCloseDirectory={() => setActiveDirectory(null)}
                      showProfilePage={showProfilePage}
                      onOpenProfilePage={() => setShowProfilePage(true)}
                      onCloseProfilePage={() => setShowProfilePage(false)}
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
                  <DeveloperToolsContent activeTool={activeTool} isInSplitMode={bothPanelsVisible} />
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
              
              {/* Show DM Page when dms tab is active */}
              {activeTab === "dms" ? (
                <DmPage currentUserId={currentUserId} />
              ) : (
                <MainContent 
                  activeTab={activeTab} 
                  isInSplitMode={false}
                  activeDirectory={activeDirectory}
                  onOpenDirectory={setActiveDirectory}
                  onCloseDirectory={() => setActiveDirectory(null)}
                  showProfilePage={showProfilePage}
                  onOpenProfilePage={() => setShowProfilePage(true)}
                  onCloseProfilePage={() => setShowProfilePage(false)}
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
              <DeveloperToolsContent activeTool={activeTool} isInSplitMode={false} />
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

        {/* Developer Sidebar - now comes SECOND (right side) */}
        {showDeveloperSidebar && (
          <DeveloperSidebar 
            activeTool={activeTool}
            onToolChange={handleToolChange}
            onClose={() => setShowDeveloperSidebar(false)}
          />
        )}
      </div>
      
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ping-theme">
      <AppContent />
    </ThemeProvider>
  );
}

