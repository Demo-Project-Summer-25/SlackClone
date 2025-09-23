import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { calendarService, EventResponse } from "../services/calendarService";
import { PongAI } from "./PingBotAI";
import { CanvasList } from "./Canvas/CanvasList";
import { CanvasViewer } from "./Canvas/CanvasViewer";
import { Canvas } from "../services/canvasService";
import {
  Plus,
  Play,
  Calendar as CalendarIcon,
  MessageSquare,
  FileCode,
  GitBranch,
  Database,
  Settings,
  MoreVertical,
  Trash2,
  Edit,
  Layout,
  Loader2
} from "lucide-react";
import { CanvasPage } from "./Canvas/CanvasPage";
import { CalendarComponent } from "./Calendar/CalendarComponent";
import { KanbanBoard } from "./Kanban/KanbanBoard";

interface DeveloperToolsContentProps {
  activeTool: string;
  isInSplitMode?: boolean;
}

export function DeveloperToolsContent({ activeTool, isInSplitMode = true }: DeveloperToolsContentProps) {
  const { currentUser } = useAuth();
  
  // Use the actual user ID from auth, fallback to Jennifer's ID
  const currentUserId = currentUser?.id || '68973614-94db-4f98-9729-0712e0c5c0fa';

  // Canvas state for wireframes
  const [selectedCanvas, setSelectedCanvas] = useState<Canvas | null>(null);

  // Fix the IDE layout logic: when in split mode (narrow), use stacked; when full screen (wide), use horizontal
  const [ideLayout, setIdeLayout] = useState<"stacked" | "horizontal">(isInSplitMode ? "stacked" : "horizontal");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const [currentMonth, setCurrentMonth] = useState("December 2024");

  const today = useMemo(() => new Date(), []);
  const [monthDate, setMonthDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const monthLabel = monthDate.toLocaleString(undefined, { month: "long", year: "numeric" });
  const monthShort = monthDate.toLocaleString(undefined, { month: "short" });
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const daysArray = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);
  const startOffset = useMemo(() => {
    const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    return (firstDay.getDay() + 6) % 7; // convert Sunday=0 to Monday=0
  }, [monthDate]);
  const calendarCells = useMemo(() => {
    const cells: Array<number | null> = [];
    for (let i = 0; i < startOffset; i += 1) {
      cells.push(null);
    }
    daysArray.forEach(day => cells.push(day));
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }
    return cells;
  }, [daysArray, startOffset]);
  
  useEffect(() => {
    if (selectedDate && selectedDate > daysInMonth) {
      setSelectedDate(null);
    }
  }, [selectedDate, daysInMonth]);
  
  const shiftMonth = (delta: number) => {
    setMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  // WireFrame boards state
  const [wireframeBoardSelection, setWireframeBoardSelection] = useState(true);
  const [selectedWireframeBoard, setSelectedWireframeBoard] = useState<string | null>(null);
  const [wireframeBoards] = useState([
    { id: "1", name: "Mock data", type: "Mock", lastModified: "Mock", description: "Mock" },
  ]);

  const renderWireFrame = () => {
    if (selectedCanvas) {
      return (
        <CanvasViewer
          canvasId={selectedCanvas.id}
          onBack={() => setSelectedCanvas(null)}
        />
      );
    }

    return (
      <CanvasList
        onSelectCanvas={setSelectedCanvas}
        currentUserId={currentUserId}
        isInSplitMode={false}
      />
    );
  };

  const renderIDE = () => {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl mb-2">IDE</h2>
            <p className="text-muted-foreground">Write and edit your code</p>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New File
          </Button>
        </div>

        <div className="bg-muted/20 rounded-lg p-4 sm:p-6">
          <p className="text-sm text-muted-foreground mb-4">File structure</p>
          <div className="flex gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-2">src/</p>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">index.tsx</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">App.tsx</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">components/</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-2">public/</p>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">favicon.ico</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">index.html</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    );
  };

  switch (activeTool) {
    case "kanban":
      return <KanbanBoard isInSplitMode={isInSplitMode} currentUserId={currentUserId} />;
    case "canvas":
      return <CanvasPage />;
    case "wireframe":
      return renderWireFrame();
    case "ai":
      return <PongAI />;  
    case "calendar":
      return <CalendarComponent isInSplitMode={isInSplitMode} />;
    case "ide":
      return renderIDE();
    default:
      return (
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Select a tool from the sidebar</p>
        </div>
      );
  }
}
