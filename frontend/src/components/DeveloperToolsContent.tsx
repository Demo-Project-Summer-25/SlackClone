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

import { PingBotAI } from "./PingBotAI";
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
import KanbanService from "../services/kanbanService";
import { KanbanBoard } from "../types/kanban";

interface DeveloperToolsContentProps {
  activeTool: string;
  isInSplitMode?: boolean;
  currentUserId: string;
}

export function DeveloperToolsContent({ activeTool, isInSplitMode = true, currentUserId }: DeveloperToolsContentProps) {
  // Fix the IDE layout logic: when in split mode (narrow), use stacked; when full screen (wide), use horizontal
  const [ideLayout, setIdeLayout] = useState<"stacked" | "horizontal">(isInSplitMode ? "stacked" : "horizontal");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const [currentMonth, setCurrentMonth] = useState("December 2024");
  const [draggedTask, setDraggedTask] = useState<{ columnId: string; cardId: string } | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  const [boards, setBoards] = useState<KanbanBoard[]>([]);
  const [boardsLoading, setBoardsLoading] = useState(false);
  const [boardsError, setBoardsError] = useState<string | null>(null);
  const [showBoardList, setShowBoardList] = useState(true);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Card modal state (create/edit)
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardForm, setCardForm] = useState<{ id?: string | null; title: string; description: string; columnId?: string | null }>({
    id: null,
    title: "",
    description: "",
    columnId: null,
  });

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

  const selectedBoard = useMemo(() => boards.find(board => board.id === selectedBoardId) ?? null, [boards, selectedBoardId]);

  const fetchBoards = useCallback(async () => {
    setBoardsLoading(true);
    setBoardsError(null);
    try {
      const data = await KanbanService.listBoards(currentUserId);
      setBoards(data);
      if (data.length === 0) {
        setSelectedBoardId(null);
        setShowBoardList(true);
      } else if (selectedBoardId) {
        const exists = data.some(board => board.id === selectedBoardId);
        if (!exists) {
          setSelectedBoardId(null);
          setShowBoardList(true);
        }
      }
    } catch (error) {
      setBoardsError(error instanceof Error ? error.message : 'Failed to load boards');
    } finally {
      setBoardsLoading(false);
    }
  }, [currentUserId, selectedBoardId]);

  const refreshBoard = useCallback(async (boardId: string) => {
    try {
      const updated = await KanbanService.getBoard(boardId);
      setBoards(prev => {
        const exists = prev.some(board => board.id === boardId);
        return exists ? prev.map(board => board.id === boardId ? updated : board) : [...prev, updated];
      });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to refresh board';
      toast.error(message);
      throw error;
    }
  }, []);

  useEffect(() => {
    if (activeTool === "kanban") {
      fetchBoards();
    }
  }, [activeTool, fetchBoards]);

  useEffect(() => {
    if (selectedBoardId && !selectedBoard) {
      setSelectedBoardId(null);
      setShowBoardList(true);
    }
  }, [selectedBoardId, selectedBoard]);

  const applyBoardUpdate = useCallback((board: KanbanBoard) => {
    setBoards(prev => {
      const exists = prev.some(item => item.id === board.id);
      return exists ? prev.map(item => (item.id === board.id ? board : item)) : [...prev, board];
    });
    return board;
  }, []);

  const handleBoardSelect = useCallback(async (boardId: string) => {
    setSelectedBoardId(boardId);
    setShowBoardList(false);
    await refreshBoard(boardId);
  }, [refreshBoard]);

  const handleDeleteBoard = useCallback(async (boardId: string) => {
    const ok = window.confirm('Delete this board? This cannot be undone.');
    if (!ok) return;
    setIsSubmitting(true);
    try {
      await KanbanService.deleteBoard(boardId);
      setBoards(prev => prev.filter(b => b.id !== boardId));
      if (selectedBoardId === boardId) {
        setSelectedBoardId(null);
        setShowBoardList(true);
      }
      toast.success('Board deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete board');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedBoardId]);

  const handleCreateBoard = useCallback(async () => {
    const name = window.prompt('What should we call the board?');
    if (!name) {
      return;
    }
    const description = window.prompt('Optional description for the board?', '') || undefined;
    setIsSubmitting(true);
    try {
      const board = await KanbanService.createBoard({ name, description, ownerId: currentUserId });
      applyBoardUpdate(board);
      setSelectedBoardId(board.id);
      setShowBoardList(false);
      toast.success('Board created');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create board';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [applyBoardUpdate, currentUserId]);

  const handleAddColumn = useCallback(async () => {
    if (!selectedBoard) {
      return;
    }
    const name = window.prompt('Column name');
    if (!name) {
      return;
    }
    setIsSubmitting(true);
    try {
      const board = await KanbanService.createColumn(selectedBoard.id, {
        boardId: selectedBoard.id,
        name,
      });
      applyBoardUpdate(board);
      toast.success('Column created');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create column';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [applyBoardUpdate, selectedBoard]);

  const openNewTaskDialog = useCallback(() => {
    if (!selectedBoard) return;
    if (!selectedBoard.columns.length) {
      toast.error('Create a column before adding tasks.');
      return;
    }
    setCardForm({ id: null, title: "", description: "", columnId: selectedBoard.columns[0].id });
    setIsCardModalOpen(true);
  }, [selectedBoard]);

  const openEditTaskDialog = useCallback((card: { id: string; title: string; description?: string | null }, columnId: string) => {
    setCardForm({ id: card.id, title: card.title, description: card.description ?? "", columnId });
    setIsCardModalOpen(true);
  }, []);

  const submitCardForm = useCallback(async () => {
    if (!selectedBoard || !cardForm.columnId) return;
    if (!cardForm.title.trim()) {
      toast.error('Title is required');
      return;
    }
    setIsSubmitting(true);
    try {
      if (cardForm.id) {
        const board = await KanbanService.updateCard(cardForm.id, {
          title: cardForm.title.trim(),
          description: cardForm.description.trim() || null,
        });
        applyBoardUpdate(board);
        toast.success('Task updated');
      } else {
        const board = await KanbanService.createCard(cardForm.columnId, {
          columnId: cardForm.columnId,
          title: cardForm.title.trim(),
          description: cardForm.description.trim() || null,
          createdBy: currentUserId,
          assignees: [],
        });
        applyBoardUpdate(board);
        toast.success('Task created');
      }
      setIsCardModalOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save task';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [applyBoardUpdate, cardForm, currentUserId, selectedBoard]);

  const handleDeleteCard = useCallback(async (cardId: string) => {
    const ok = window.confirm('Delete this task?');
    if (!ok) return;
    setIsSubmitting(true);
    try {
      const board = await KanbanService.deleteCard(cardId);
      applyBoardUpdate(board);
      toast.success('Task deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete task');
    } finally {
      setIsSubmitting(false);
    }
  }, [applyBoardUpdate]);

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
    description?: string;
    location?: string;
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
          description: event.description || undefined,
          location: event.location || undefined,
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

  const handleDragStart = (e: React.DragEvent, columnId: string, cardId: string) => {
    setDraggedTask({ columnId, cardId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnterColumn = (columnId: string) => {
    setDragOverColumnId(columnId);
  };

  const handleDragLeaveColumn = () => {
    setDragOverColumnId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    if (!draggedTask || !selectedBoard) {
      return;
    }

    const { columnId: sourceColumnId, cardId } = draggedTask;

    if (sourceColumnId === targetColumnId) {
      setDraggedTask(null);
      return;
    }

    try {
      const board = await KanbanService.updateCard(cardId, { columnId: targetColumnId });
      applyBoardUpdate(board);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to move task';
      toast.error(message);
    } finally {
      setDraggedTask(null);
      setDragOverColumnId(null);
    }
  };

  const renderKanban = () => {
    if (boardsLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading boards…</span>
          </div>
        </div>
      );
    }

    if (boardsError) {
      return (
        <div className="p-6">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <p className="text-sm text-muted-foreground">{boardsError}</p>
              <Button onClick={fetchBoards}>Try again</Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (showBoardList || !selectedBoard) {
      return (
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl mb-2">Kanban Boards</h2>
              <p className="text-muted-foreground">Select a board to view its workflow</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreateBoard} disabled={isSubmitting}>
                <Plus className="w-4 h-4 mr-2" />
                New Board
              </Button>
            </div>
          </div>

          {boards.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center text-muted-foreground">
                No boards yet. Create your first board to start tracking work.
              </CardContent>
            </Card>
          ) : (
            <div className={`grid gap-4 ${isInSplitMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
              {boards.map((board) => {
                const columnCount = board.columns.length;
                const taskCount = board.columns.reduce((sum, column) => sum + column.cards.length, 0);
                return (
                  <Card
                    key={board.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleBoardSelect(board.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg truncate">{board.name}</CardTitle>
                          {board.description && (
                            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{board.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Delete board"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBoard(board.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline">{columnCount} columns</Badge>
                        <Badge variant="outline">{taskCount} tasks</Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const sortedColumns = [...selectedBoard.columns].sort((a, b) => {
      const aPos = a.position ?? 0;
      const bPos = b.position ?? 0;
      if (aPos === bPos) {
        return a.name.localeCompare(b.name);
      }
      return aPos - bPos;
    });

    return (
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowBoardList(true);
                setSelectedBoardId(null);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to Boards
            </Button>
            <div>
              <h2 className="text-2xl mb-1">{selectedBoard.name}</h2>
              {selectedBoard.description && (
                <p className="text-muted-foreground">{selectedBoard.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleAddColumn} disabled={isSubmitting}>
              <Plus className="w-4 h-4 mr-2" />
              Add Column
            </Button>
            <Button className="w-fit" onClick={openNewTaskDialog} disabled={isSubmitting || !sortedColumns.length}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
            <Button variant="outline" onClick={() => handleDeleteBoard(selectedBoard.id)} disabled={isSubmitting}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Board
            </Button>
          </div>
        </div>

        <div className="flex gap-4 sm:gap-6 overflow-x-auto min-h-[500px]">
          {sortedColumns.length === 0 ? (
            <Card className="flex-1 min-w-[280px] border-dashed">
              <CardContent className="p-6 text-center text-muted-foreground">
                No columns yet. Add your first column to start planning work.
              </CardContent>
            </Card>
          ) : (
            sortedColumns.map((column) => (
              <div
                key={column.id}
                className={`flex-1 min-w-[280px] space-y-3 transition-colors ${dragOverColumnId === column.id ? 'bg-muted/30 rounded-lg' : ''}`}
                onDragOver={handleDragOver}
                onDragEnter={() => handleDragEnterColumn(column.id)}
                onDragLeave={handleDragLeaveColumn}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{column.name}</h3>
                  <Badge variant="secondary">{column.cards.length}</Badge>
                </div>

                <div className="space-y-2 min-h-[400px] bg-muted/20 rounded-lg p-2">
                  {column.cards.length === 0 ? (
                    <div className={`text-sm text-muted-foreground p-3 border border-dashed rounded-md ${dragOverColumnId === column.id ? 'border-primary text-primary' : 'border-muted'}`}>
                      {dragOverColumnId === column.id ? 'Drop task here' : 'No tasks yet'}
                    </div>
                  ) : (
                    column.cards
                      .slice()
                      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                      .map((card) => {
                        const dueLabel = card.dueAt ? `Due ${new Date(card.dueAt).toLocaleDateString()}` : 'No due date';
                        const priorityColor = card.priorityColor ?? undefined;
                        return (
                          <Card
                            key={card.id}
                            className="cursor-move hover:shadow-sm transition-shadow"
                            draggable
                            onDragStart={(e) => handleDragStart(e, column.id, card.id)}
                            onDoubleClick={() => openEditTaskDialog(card, column.id)}
                          >
                            <CardContent className="p-3 space-y-2">
                              <div className="flex justify-end -mt-1 -mr-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Delete task"
                                  onClick={(e) => { e.stopPropagation(); handleDeleteCard(card.id); }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <p className="text-sm font-medium leading-5">{card.title}</p>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                {card.priorityLabel && (
                                  <Badge
                                    variant="outline"
                                    style={priorityColor ? { borderColor: priorityColor, color: priorityColor } : undefined}
                                  >
                                    {card.priorityLabel}
                                  </Badge>
                                )}
                                <span>{dueLabel}</span>
                                {card.assignees.length > 0 && (
                                  <span>{card.assignees.length} assignee{card.assignees.length === 1 ? '' : 's'}</span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Card Create/Edit Modal */}
        <Dialog open={isCardModalOpen} onOpenChange={setIsCardModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{cardForm.id ? 'Edit Task' : 'New Task'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  placeholder="Short summary"
                  value={cardForm.title}
                  onChange={(e) => setCardForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-desc">Description</Label>
                <Textarea
                  id="task-desc"
                  placeholder="Details, acceptance criteria, links..."
                  value={cardForm.description}
                  onChange={(e) => setCardForm(f => ({ ...f, description: e.target.value }))}
                  rows={6}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCardModalOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={submitCardForm} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving…' : 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
      return renderKanban();
    case "canvas":
      return <CanvasPage />;
    case "ai":
      return <PingBotAI />;  
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
