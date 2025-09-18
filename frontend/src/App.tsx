import { useState } from "react";
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
  PanelRightOpen
} from "lucide-react";

function AppContent() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [activeTool, setActiveTool] = useState("kanban");
  const [showDeveloperSidebar, setShowDeveloperSidebar] = useState(true);
  const [showMainContent, setShowMainContent] = useState(true);
  const [showDevTools, setShowDevTools] = useState(true);
  const [splitScreenMode, setSplitScreenMode] = useState(true);

  // Handle split screen mode toggle
  const handleSplitScreenToggle = (enabled: boolean) => {
    setSplitScreenMode(enabled);
    
    if (enabled) {
      // If turning on split screen, automatically open AI bot on the right
      setShowDevTools(true);
      setActiveTool("ai"); // Automatically open AI bot
      
      // If no main content is open, open terminals
      if (!showMainContent) {
        setShowMainContent(true);
      }
    } else {
      // If turning off split screen and both panels are open, close dev tools panel
      if (showMainContent && showDevTools) {
        setShowDevTools(false);
      }
    }
  };

  const [activeDM, setActiveDM] = useState<{
    name: string;
    status: "online" | "away" | "offline";
    lastMessage: string;
  } | null>(null);
  const [activeDirectory, setActiveDirectory] = useState<{
    name: string;
    description: string;
    memberCount: number;
    isPrivate: boolean;
  } | null>(null);

  const [activeTerminal, setActiveTerminal] = useState<{
    id: string;
    name: string;
    type: string;
    status: "Active" | "Inactive";
  } | null>(null);

  const [showProfilePage, setShowProfilePage] = useState(false);

  // Handle tab changes with split screen logic
  const handleTabChange = (tab: string) => {
    const openPanelsCount = (showMainContent ? 1 : 0) + (showDevTools ? 1 : 0);

    // Close any open DM, directory, terminal, or profile page when switching tabs
    setActiveDM(null);
    setActiveDirectory(null);
    setActiveTerminal(null);
    setShowProfilePage(false);

    if (!splitScreenMode) {
      // Single screen mode - close other panels when opening a new one
      setActiveTab(tab);
      setShowMainContent(true);
      setShowDevTools(false);
    } else {
      // Split screen mode - allow up to 2 panels of any type
      setActiveTab(tab);
      
      if (!showMainContent) {
        if (openPanelsCount >= 2) {
          toast.error("Close a tab to open a new one", {
            description: "You can only have 2 panels open in split screen mode"
          });
          return;
        }
        setShowMainContent(true);
      }
    }
  };

  // Handle developer tool changes with split screen logic
  const handleToolChange = (tool: string) => {
    const openPanelsCount = (showMainContent ? 1 : 0) + (showDevTools ? 1 : 0);

    if (!splitScreenMode) {
      // Single screen mode - close main content and show dev tools
      setActiveTool(tool);
      setShowDevTools(true);
      setShowMainContent(false);
    } else {
      // Split screen mode - allow up to 2 panels
      if (!showDevTools) {
        if (openPanelsCount >= 2) {
          toast.error("Close a tab to open a new one", {
            description: "You can only have 2 panels open in split screen mode"
          });
          return;
        }
        setShowDevTools(true);
      }
      setActiveTool(tool);
    }
  };

  const bothPanelsVisible = showMainContent && showDevTools;
  const onlyMainVisible = showMainContent && !showDevTools;
  const onlyDevToolsVisible = !showMainContent && showDevTools;

  // Handle terminal selection - no action needed, just for display
  const handleTerminalSelect = (terminal: { id: string; name: string; type: string; status: "Active" | "Inactive" }) => {
    // Terminal selection is purely informational - no panels need to open
  };

  // Handle panel closing with split screen mode considerations
  const handleCloseMainContent = () => {
    setShowMainContent(false);
    // Clear any active conversations when closing main content
    setActiveDM(null);
    setActiveDirectory(null);
    setActiveTerminal(null);
    setShowProfilePage(false);
  };

  const handleCloseDevTools = () => {
    setShowDevTools(false);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toggle button only for sidebar when hidden */}
      {!showDeveloperSidebar && (
        <div className="absolute top-2 right-2 z-50 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeveloperSidebar(true)}
            className="bg-background/90 backdrop-blur-sm"
          >
            <PanelRightOpen className="w-4 h-4 mr-2" />
            Show Sidebar
          </Button>
        </div>
      )}

      <TopNavigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        splitScreenMode={splitScreenMode}
        onSplitScreenToggle={handleSplitScreenToggle}
        onTerminalSelect={handleTerminalSelect}
      />
      
      <div className="flex-1 flex overflow-hidden">
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
                  <MainContent 
                    activeTab={activeTab} 
                    isInSplitMode={bothPanelsVisible}
                    activeDM={activeDM}
                    onOpenDM={setActiveDM}
                    onCloseDM={() => setActiveDM(null)}
                    activeDirectory={activeDirectory}
                    onOpenDirectory={setActiveDirectory}
                    onCloseDirectory={() => setActiveDirectory(null)}
                    activeTerminal={activeTerminal}
                    onCloseTerminal={() => setActiveTerminal(null)}
                    showProfilePage={showProfilePage}
                    onOpenProfilePage={() => setShowProfilePage(true)}
                    onCloseProfilePage={() => setShowProfilePage(false)}
                  />
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
              <MainContent 
                activeTab={activeTab} 
                isInSplitMode={false}
                activeDM={activeDM}
                onOpenDM={setActiveDM}
                onCloseDM={() => setActiveDM(null)}
                activeDirectory={activeDirectory}
                onOpenDirectory={setActiveDirectory}
                onCloseDirectory={() => setActiveDirectory(null)}
                activeTerminal={activeTerminal}
                onCloseTerminal={() => setActiveTerminal(null)}
                showProfilePage={showProfilePage}
                onOpenProfilePage={() => setShowProfilePage(true)}
                onCloseProfilePage={() => setShowProfilePage(false)}
              />
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
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">No panels open</p>
                <div className="flex gap-2">
                  <Button onClick={() => setShowMainContent(true)}>
                    <Terminal className="w-4 h-4 mr-2" />
                    Open Main
                  </Button>
                  <Button onClick={() => setShowDevTools(true)}>
                    <Kanban className="w-4 h-4 mr-2" />
                    Open Dev Tools
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {showDeveloperSidebar && (
          <div className="relative">
            <DeveloperSidebar activeTool={activeTool} onToolChange={handleToolChange} />
          </div>
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