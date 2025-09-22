import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
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
  Layout
} from "lucide-react";

interface DeveloperToolsContentProps {
  activeTool: string;
  isInSplitMode?: boolean;
}

export function DeveloperToolsContent({ activeTool, isInSplitMode = true }: DeveloperToolsContentProps) {
  // Fix the IDE layout logic: when in split mode (narrow), use stacked; when full screen (wide), use horizontal
  const [ideLayout, setIdeLayout] = useState<"stacked" | "horizontal">(isInSplitMode ? "stacked" : "horizontal");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState("December 2024");
  const [draggedTask, setDraggedTask] = useState<{ columnId: string; taskIndex: number } | null>(null);

  // WireFrame boards state
  const [wireframeBoardSelection, setWireframeBoardSelection] = useState(true);
  const [selectedWireframeBoard, setSelectedWireframeBoard] = useState<string | null>(null);
  const [wireframeBoards] = useState([
    { id: "1", name: "Mock data", type: "Mock", lastModified: "Mock", description: "Mock" },
  ]);

  // BackLog boards state
  const [backlogBoardSelection, setBacklogBoardSelection] = useState(true);
  const [selectedBacklogBoard, setSelectedBacklogBoard] = useState<string | null>(null);
  const [backlogBoards] = useState([
    { id: "1", name: "Mock", type: "Mock", lastModified: "Mock", description: "" },
  ]);

  // Different kanban data for each board
  const backlogBoardData = {
    "1": {
      "todo": [
        { id: "1", title: "Mock", priority: "High", days: "Mock" },
      ],
      "progress": [
        { id: "2", title: "Mock", priority: "Medium", days: "Mock" },
      ],
      "done": [
        { id: "3", title: "Mock", priority: "Low", days: "Mock" },
      ]
    },
  };

  // Current kanban data for selected board
  const [kanbanData, setKanbanData] = useState(backlogBoardData["1"]);

  const eventsData = {
    5: [
      { title: "Mock", time: "9:00 AM", type: "meeting" },
      { title: "Mock", time: "2:00 PM", type: "review" },
    ],
    12: [
      { title: "Mock", time: "10:00 AM", type: "planning" },
    ],
    16: [
      { title: "Mock", time: "10:00 AM", type: "discussion" },
      { title: "Mock", time: "2:00 PM", type: "demo" },
    ],
    18: [
      { title: "Mock", time: "11:00 AM", type: "review" }
    ],
    22: [
      { title: "Mock", time: "Mock", type: "meeting" },
    ]
  };

  const upcomingEvents = [
    { title: "Mock", time: "10:00 AM", date: "Today", day: 16 },
  ];

  const handleDragStart = (e: React.DragEvent, columnId: string, taskIndex: number) => {
    setDraggedTask({ columnId, taskIndex });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    if (!draggedTask) return;

    const { columnId: sourceColumnId, taskIndex } = draggedTask;

    if (sourceColumnId === targetColumnId) {
      setDraggedTask(null);
      return;
    }

    setKanbanData(prev => {
      const newData = { ...prev };
      const task = newData[sourceColumnId][taskIndex];

      // Remove from source
      newData[sourceColumnId] = newData[sourceColumnId].filter((_, i) => i !== taskIndex);

      // Add to target
      newData[targetColumnId] = [...newData[targetColumnId], task];

      return newData;
    });

    setDraggedTask(null);
  };

  const renderKanban = () => {
    // If no board is selected, show board selection screen
    if (backlogBoardSelection || !selectedBacklogBoard) {
      return (
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl mb-2">BackLog</h2>
              <p className="text-muted-foreground">Select a backlog board to manage your tasks</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Layout className="w-4 h-4 mr-2" />
                Templates
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Board
              </Button>
            </div>
          </div>

          <div className={`grid gap-4 ${isInSplitMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
            {backlogBoards.map((board) => (
              <Card
                key={board.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedBacklogBoard(board.id);
                  setBacklogBoardSelection(false);
                  setKanbanData(backlogBoardData[board.id]);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg truncate">{board.name}</CardTitle>
                      <Badge variant="outline" className="w-fit text-xs mt-2">{board.type}</Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 h-24 sm:h-32 rounded-md mb-3 flex items-center justify-center">
                    <div className="text-muted-foreground text-xs sm:text-sm">Task Board Preview</div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">{board.description}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Modified {board.lastModified}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    // Show the actual kanban board
    const selectedBoard = backlogBoards.find(board => board.id === selectedBacklogBoard);

    const columns = [
      { id: "todo", title: "To Do", data: kanbanData.todo },
      { id: "progress", title: "In Progress", data: kanbanData.progress },
      { id: "done", title: "Done", data: kanbanData.done },
    ];

    return (
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setBacklogBoardSelection(true);
                setSelectedBacklogBoard(null);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to Boards
            </Button>
            <div>
              <h2 className="text-2xl mb-1">{selectedBoard?.name || 'BackLog Board'}</h2>
              <p className="text-muted-foreground">{selectedBoard?.description || 'Manage your development tasks'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Board
            </Button>
            <Button className="w-fit">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        <div className="flex gap-4 sm:gap-6 overflow-x-auto min-h-[500px]">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex-1 min-w-[280px] space-y-3"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{column.title}</h3>
                <Badge variant="secondary">{column.data.length}</Badge>
              </div>

              <div className="space-y-2 min-h-[400px] bg-muted/20 rounded-lg p-2">
                {column.data.map((task, i) => (
                  <Card
                    key={task.id}
                    className="cursor-move hover:shadow-sm transition-shadow"
                    draggable
                    onDragStart={(e) => handleDragStart(e, column.id, i)}
                  >
                    <CardContent className="p-3">
                      <p className="text-sm mb-2">{task.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge
                          variant="outline"
                          className={`text-xs ${task.priority === "High" ? "border-red-500 text-red-700" :
                            task.priority === "Medium" ? "border-yellow-500 text-yellow-700" :
                              "border-green-500 text-green-700"
                            }`}
                        >
                          {task.priority}
                        </Badge>
                        <span className="hidden sm:inline">{task.days}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {column.data.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">Drop tasks here</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWireFrame = () => {
    // If no board is selected, show board selection screen
    if (wireframeBoardSelection || !selectedWireframeBoard) {
      return (
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl mb-2">WireFrame</h2>
              <p className="text-muted-foreground">Select a wireframe board to start designing</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Layout className="w-4 h-4 mr-2" />
                Templates
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Board
              </Button>
            </div>
          </div>

          <div className={`grid gap-4 ${isInSplitMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
            {wireframeBoards.map((board) => (
              <Card
                key={board.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedWireframeBoard(board.id);
                  setWireframeBoardSelection(false);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg truncate">{board.name}</CardTitle>
                      <Badge variant="outline" className="w-fit text-xs mt-2">{board.type}</Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 h-24 sm:h-32 rounded-md mb-3 flex items-center justify-center">
                    <div className="text-muted-foreground text-xs sm:text-sm">Wireframe Preview</div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">{board.description}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Modified {board.lastModified}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    // Show the actual wireframe editor with drag and drop
    const selectedBoard = wireframeBoards.find(board => board.id === selectedWireframeBoard);

    return (
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setWireframeBoardSelection(true);
                setSelectedWireframeBoard(null);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to Boards
            </Button>
            <div>
              <h2 className="text-2xl mb-1">{selectedBoard?.name || 'WireFrame Board'}</h2>
              <p className="text-muted-foreground">{selectedBoard?.description || 'Design your wireframes'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Info
            </Button>
            <Button variant="outline" size="sm">Templates</Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Element
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

    const getEventTypeColor = (type: string) => {
      switch (type) {
        case "meeting": return "bg-blue-500";
        case "review": return "bg-green-500";
        case "planning": return "bg-purple-500";
        case "discussion": return "bg-orange-500";
        case "demo": return "bg-red-500";
        default: return "bg-gray-500";
      }
    };

    return (
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl mb-2">Calendar</h2>
            <p className="text-muted-foreground">Manage your development schedule</p>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        <div className={`grid gap-6 ${isInSplitMode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{currentMonth}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">‹</Button>
                    <Button variant="outline" size="sm">›</Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {days.map(day => (
                    <div key={day} className="p-2 text-center text-sm text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {daysInMonth.map(day => {
                    const events = eventsData[day] || [];
                    const isSelected = selectedDate === day;

                    return (
                      <div
                        key={day}
                        className={`min-h-[60px] p-1 border rounded cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                          }`}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className="text-sm">{day}</div>
                        <div className="space-y-1">
                          {events.slice(0, 2).map((event, i) => (
                            <div
                              key={i}
                              className={`w-full h-1.5 rounded ${getEventTypeColor(event.type)}`}
                            />
                          ))}
                          {events.length > 2 && (
                            <div className="text-xs text-muted-foreground">+{events.length - 2}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {selectedDate && eventsData[selectedDate] ? (
              <Card>
                <CardHeader>
                  <CardTitle>Events for {selectedDate} Dec</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {eventsData[selectedDate].map((event, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                      <div className="flex-1">
                        <p className="text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingEvents.map((event, i) => (
                    <div key={i} className="flex items-center gap-6 p-3 border rounded-lg">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm">{event.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{event.time}</span>
                          <span>•</span>
                          <span>{event.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAI = () => {
    return (
      <div className="p-4 sm:p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl mb-2">PingBot AI</h2>
            <p className="text-muted-foreground">Hello! I'm Pingbot. Your personal coding assistant. What are we working on today?</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 space-y-8 mb-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center">
              <img
                src="/bot.png"
                alt="PingBot"
                className="w-8 h-8 object-contain"
                style={{ display: "block" }}
              />
            </div>
            <div className="flex-1 bg-muted p-3 rounded-lg">
              <p className="text-sm">I'm ready to help you with your development tasks. I can assist with:</p>
              <ul className="text-sm mt-2 space-y-1 text-muted-foreground">
                <li>• Code debugging</li>
                <li>• File structure recommendations</li>
                <li>• Task planning and estimation</li>
                <li>• Keywords, functions and APIs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t pt-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask PingBot anything about your code..."
              className="flex-1 px-3 py-2 border rounded-lg bg-background text-sm"
            />
            <Button size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    );
  };
  switch (activeTool) {
    case "kanban":
      return renderKanban();
    case "uml":
      return renderWireFrame();
    case "ai":
      return renderAI();
    case "calendar":
      return renderCalendar();
    default:
      return (
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Select a tool from the sidebar</p>
        </div>
      );
  }
}