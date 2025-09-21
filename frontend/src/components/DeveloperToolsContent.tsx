import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { calendarService, EventResponse } from "../services/calendarService";
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
import { CanvasPage } from './Canvas/CanvasPage';

interface DeveloperToolsContentProps {
  activeTool: string;
  isInSplitMode?: boolean;
}

export function DeveloperToolsContent({ activeTool, isInSplitMode = true }: DeveloperToolsContentProps) {
  // Fix the IDE layout logic: when in split mode (narrow), use stacked; when full screen (wide), use horizontal
  const [ideLayout, setIdeLayout] = useState<"stacked" | "horizontal">(isInSplitMode ? "stacked" : "horizontal");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

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

  type CalendarEventDetails = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    timeLabel: string;
    visibility: EventResponse["visibility"];
  };

  type NormalizedEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    time: string;
    timeLabel: string;
    dateLabel: string;
    visibility: EventResponse["visibility"];
  };

  const { currentUser, isLoading: authLoading } = useAuth();
  const [eventsRaw, setEventsRaw] = useState<EventResponse[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isDayEventsOpen, setIsDayEventsOpen] = useState(false);
  const [dayDialogDay, setDayDialogDay] = useState<number | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [submittingEvent, setSubmittingEvent] = useState(false);
  const [eventError, setEventError] = useState<string | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [newEventForm, setNewEventForm] = useState({
    title: "",
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    description: "",
    location: "",
    visibility: "PRIVATE" as EventResponse["visibility"],
  });

  const timeFormatter = useMemo(
    () => new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }),
    []
  );
  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }),
    []
  );
  const timezoneId = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC", []);

  const fetchEvents = useCallback(async () => {
    if (!currentUser?.id) return;
    setEventsLoading(true);
    setEventsError(null);
    try {
      const from = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).toISOString();
      const to = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1).toISOString();
      await calendarService.createOrGetMyCalendar(currentUser.id);
      const events = await calendarService.listEvents(currentUser.id, from, to);
      setEventsRaw(events);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load events.";
      setEventsError(message);
      toast.error(message);
      setEventsRaw([]);
    } finally {
      setEventsLoading(false);
    }
  }, [currentUser?.id, monthDate]);

  useEffect(() => {
    if (!authLoading) {
      fetchEvents();
    }
  }, [authLoading, fetchEvents]);

  useEffect(() => {
    if (!isDayEventsOpen) {
      setDayDialogDay(null);
    }
  }, [isDayEventsOpen]);

  const normalizedEvents = useMemo<NormalizedEvent[]>(() => {
    return eventsRaw
      .map(event => {
        const start = new Date(event.startsAt);
        const end = new Date(event.endsAt);
        return {
          id: event.id,
          title: event.title,
          start,
          end,
          time: timeFormatter.format(start),
          timeLabel: timeFormatter.format(start),
          dateLabel: dateFormatter.format(start),
          visibility: event.visibility,
          description: event.description,
          location: event.location,
        };
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [eventsRaw, timeFormatter, dateFormatter]);

  const eventsByDay = useMemo<Record<number, CalendarEventDetails[]>>(() => {
    const grouped: Record<number, CalendarEventDetails[]> = {};
    normalizedEvents.forEach(event => {
      const day = event.start.getDate();
      const entry: CalendarEventDetails = {
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        timeLabel: event.time,
        visibility: event.visibility,
      };
      grouped[day] = grouped[day] ? [...grouped[day], entry] : [entry];
    });
    Object.values(grouped).forEach(list => list.sort((a, b) => a.start.getTime() - b.start.getTime()));
    return grouped;
  }, [normalizedEvents]);

  const upcomingEvents = useMemo(() => normalizedEvents.slice(0, 4), [normalizedEvents]);

  const dayDialogEvents = useMemo(() => {
    if (dayDialogDay === null) return [] as NormalizedEvent[];
    return normalizedEvents.filter(event => event.start.getDate() === dayDialogDay);
  }, [normalizedEvents, dayDialogDay]);

  const formatDateForInput = useCallback((date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const handleDialogOpenChange = (open: boolean) => {
    setIsAddEventOpen(open);
    if (!open) {
      setEventError(null);
      setEditingEventId(null);
    }
  };

  const handleOpenAddEvent = () => {
    const baseDay = selectedDate ?? today.getDate();
    const targetDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), baseDay);
    setNewEventForm({
      title: "",
      date: formatDateForInput(targetDate),
      startTime: "09:00",
      endTime: "10:00",
      description: "",
      location: "",
      visibility: "PRIVATE",
    });
    setEventError(null);
    setIsAddEventOpen(true);
  };

  const handleOpenEditEvent = (event: NormalizedEvent) => {
    const startLocal = event.start;
    const endLocal = event.end;
    const formatTimeForInput = (date: Date) =>
      date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
    setNewEventForm({
      title: event.title,
      date: formatDateForInput(startLocal),
      startTime: formatTimeForInput(startLocal),
      endTime: formatTimeForInput(endLocal),
      description: event.description || "",
      location: event.location || "",
      visibility: event.visibility,
    });
    setEditingEventId(event.id);
    setEventError(null);
    setIsAddEventOpen(true);
  };

  const handleCreateEvent = async () => {
    if (!currentUser?.id) return;
    const { title, date, startTime, endTime, description, location, visibility } = newEventForm;

    if (!title.trim()) {
      setEventError("Title is required.");
      return;
    }

    if (!date || !startTime || !endTime) {
      setEventError("Date and time are required.");
      return;
    }

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    if (!(end.getTime() > start.getTime())) {
      setEventError("End time must be after start time.");
      return;
    }

    setSubmittingEvent(true);
    try {
      const startIso = start.toISOString();
      const endIso = end.toISOString();

      if (editingEventId) {
        const updated = await calendarService.updateEvent(currentUser.id, editingEventId, {
          title: title.trim(),
          startsAt: startIso,
          endsAt: endIso,
          timezone: timezoneId,
          description: description ? description.trim() : null,
          location: location ? location.trim() : null,
          visibility,
        });

        const updatedStart = new Date(updated.startsAt);
        const staysInMonth =
          updatedStart.getFullYear() === monthDate.getFullYear() &&
          updatedStart.getMonth() === monthDate.getMonth();

        setEventsRaw(prev => {
          const filtered = prev.filter(event => event.id !== updated.id);
          return staysInMonth ? [...filtered, updated] : filtered;
        });

        if (!staysInMonth) {
          setMonthDate(new Date(updatedStart.getFullYear(), updatedStart.getMonth(), 1));
        }

        toast.success("Event updated.");
      } else {
        const created = await calendarService.createEvent(currentUser.id, {
          title: title.trim(),
          startsAt: startIso,
          endsAt: endIso,
          timezone: timezoneId,
          description: description ? description.trim() : undefined,
          location: location ? location.trim() : undefined,
          visibility,
        });

        toast.success("Event created.");
        const createdStart = new Date(created.startsAt);
        if (
          createdStart.getFullYear() === monthDate.getFullYear() &&
          createdStart.getMonth() === monthDate.getMonth()
        ) {
          setEventsRaw(prev => [...prev, created]);
        } else {
          setMonthDate(new Date(createdStart.getFullYear(), createdStart.getMonth(), 1));
        }
      }

      setIsAddEventOpen(false);
      setEventError(null);
      setEditingEventId(null);
  } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create event.";
      setEventError(message);
      toast.error(message);
    } finally {
      setSubmittingEvent(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!currentUser?.id) return;
    const target = eventsRaw.find(event => event.id === eventId);
    setDeletingEventId(eventId);
    try {
      await calendarService.deleteEvent(currentUser.id, eventId);
      setEventsRaw(prev => prev.filter(event => event.id !== eventId));
      toast.success("Event deleted.");

      if (target) {
        const eventDay = new Date(target.startsAt).getDate();
        const remaining = eventsRaw.filter(event => event.id !== eventId && new Date(event.startsAt).getDate() === eventDay);
        if (remaining.length === 0) {
          setIsDayEventsOpen(false);
          setDayDialogDay(null);
          if (selectedDate === eventDay) {
            setSelectedDate(null);
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete event.";
      toast.error(message);
    } finally {
      setDeletingEventId(null);
    }
  };

  const handleOpenDayEvents = (day: number) => {
    setSelectedDate(day);
    setDayDialogDay(day);
    setIsDayEventsOpen(true);
  };

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

    const getVisibilityColor = (visibility: EventResponse["visibility"]) => {
      switch (visibility) {
        case "PUBLIC":
          return "bg-green-500";
        case "CHANNEL":
          return "bg-orange-500";
        default:
          return "bg-blue-500";
      }
    };

    return (
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl mb-2">Calendar</h2>
            <p className="text-muted-foreground">Manage your development schedule</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleOpenAddEvent}
              disabled={eventsLoading || submittingEvent || !currentUser}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>

        {eventsError && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {eventsError}
          </div>
        )}

        <Dialog open={isAddEventOpen} onOpenChange={handleDialogOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newEventForm.title}
                  onChange={e => setNewEventForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Event title"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={newEventForm.date}
                    onChange={e => setNewEventForm(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Start Time</label>
                  <Input
                    type="time"
                    value={newEventForm.startTime}
                    onChange={e => setNewEventForm(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">End Time</label>
                  <Input
                    type="time"
                    value={newEventForm.endTime}
                    onChange={e => setNewEventForm(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={newEventForm.location}
                    onChange={e => setNewEventForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  rows={3}
                  value={newEventForm.description}
                  onChange={e => setNewEventForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional details"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Visibility</label>
                <select
                  className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
                  value={newEventForm.visibility}
                  onChange={e =>
                    setNewEventForm(prev => ({
                      ...prev,
                      visibility: e.target.value as EventResponse["visibility"],
                    }))
                  }
                >
                  <option value="PRIVATE">Private</option>
                  <option value="PUBLIC">Public</option>
                  <option value="CHANNEL">Channel</option>
                </select>
              </div>
              {eventError && <p className="text-sm text-red-600">{eventError}</p>}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => handleDialogOpenChange(false)} disabled={submittingEvent}>
                Cancel
              </Button>
              <Button onClick={handleCreateEvent} disabled={submittingEvent}>
                {submittingEvent ? "Saving…" : "Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isDayEventsOpen} onOpenChange={setIsDayEventsOpen}>
          <DialogContent className="max-h-[70vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {dayDialogDay !== null
                  ? `Events for ${monthShort} ${dayDialogDay}`
                  : "Events"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {eventsLoading ? (
                <p className="text-sm text-muted-foreground">Loading events…</p>
              ) : dayDialogEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No events scheduled for this day.</p>
              ) : (
                dayDialogEvents.map(event => (
                  <div key={event.id} className="border rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.timeLabel} • {event.dateLabel}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditEvent(event)}
                          disabled={submittingEvent}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="bg-black text-white hover:bg-black/90"
                          onClick={() => handleDeleteEvent(event.id)}
                          disabled={deletingEventId === event.id}
                        >
                          {deletingEventId === event.id ? "Deleting…" : "Delete"}
                        </Button>
                      </div>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    )}
                    {event.location && (
                      <p className="text-xs text-muted-foreground">Location: {event.location}</p>
                    )}
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      {event.visibility}
                    </span>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        <div className={`grid gap-6 ${isInSplitMode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{monthLabel}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => shiftMonth(-1)} aria-label="Previous month">‹</Button>
                    <Button variant="outline" size="sm" onClick={() => shiftMonth(1)} aria-label="Next month">›</Button>
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
                  {calendarCells.map((cell, index) => {
                    if (cell === null) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="min-h-[60px] rounded border border-transparent"
                        />
                      );
                    }

                    const day = cell;
                    const dayEvents = eventsByDay[day] || [];
                    const isSelected = selectedDate === day;
                    const isToday =
                      monthDate.getFullYear() === today.getFullYear() &&
                      monthDate.getMonth() === today.getMonth() &&
                      day === today.getDate();

                    const cellClasses = [
                      "min-h-[60px] p-1 rounded cursor-pointer transition-colors",
                      isSelected ? "border-2 border-black bg-primary/10" : "border border-transparent hover:bg-muted/50",
                      !isSelected && isToday ? "border-2 border-black" : "",
                    ].join(" ");

                    return (
                      <div key={day} className={cellClasses} onClick={() => handleOpenDayEvents(day)}>
                        <div className={`text-sm ${isToday ? 'font-semibold text-primary' : ''}`}>{day}</div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={`w-full h-1.5 rounded ${getVisibilityColor(event.visibility)}`}
                            />
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground">+{dayEvents.length - 2}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {eventsLoading && (
                  <div className="mt-4 text-sm text-muted-foreground">Loading events…</div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {selectedDate && eventsByDay[selectedDate] ? (
              <Card>
                <CardHeader>
                  <CardTitle>Events for {selectedDate} {monthShort}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {eventsByDay[selectedDate].map(event => (
                    <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${getVisibilityColor(event.visibility)}`} />
                      <div className="flex-1">
                        <p className="text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.timeLabel}</p>
                      </div>
                    </div>
                  ))}
                  {eventsByDay[selectedDate].length === 0 && (
                    <p className="text-sm text-muted-foreground">No events for this day.</p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {eventsLoading ? "Loading events…" : "No events scheduled."}
                    </p>
                  ) : (
                    upcomingEvents.map(event => (
                      <div key={event.id} className="flex items-center gap-6 p-3 border rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${getVisibilityColor(event.visibility)}`} />
                        <div className="flex-1">
                          <p className="text-sm">{event.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{event.timeLabel}</span>
                            <span>•</span>
                            <span>{event.dateLabel}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
    case "canvas":
      return <CanvasPage />;
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
