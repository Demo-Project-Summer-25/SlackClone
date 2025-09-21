import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
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
import { toast } from "sonner";
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
