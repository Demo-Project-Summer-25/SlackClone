import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Plus, Trash2, Loader2, Edit, Calendar, MoreVertical, Layout } from 'lucide-react';
import KanbanService from '../../services/kanbanService';
import { KanbanBoard as KanbanBoardType } from '../../types/kanban';

interface KanbanBoardProps {
  isInSplitMode?: boolean;
  currentUserId: string;
}

export function KanbanBoard({ isInSplitMode = false, currentUserId }: KanbanBoardProps) {
  // State management
  const [boards, setBoards] = useState<KanbanBoardType[]>([]);
  const [boardsLoading, setBoardsLoading] = useState(false);
  const [boardsError, setBoardsError] = useState<string | null>(null);
  const [showBoardList, setShowBoardList] = useState(true);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Board creation/edit dialog state
  const [isBoardDialogOpen, setIsBoardDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [boardForm, setBoardForm] = useState({
    name: '',
    description: ''
  });

  // Card modal state (create/edit)
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardForm, setCardForm] = useState<{
    id?: string | null;
    title: string;
    description: string;
    columnId?: string | null;
  }>({
    id: null,
    title: '',
    description: '',
    columnId: null,
  });

  // Drag and drop state
  const [draggedTask, setDraggedTask] = useState<{ columnId: string; cardId: string } | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  const selectedBoard = useMemo(() => 
    boards.find(board => board.id === selectedBoardId) ?? null, 
    [boards, selectedBoardId]
  );

  // Simple fetchBoards without any default board creation
  const fetchBoards = useCallback(async () => {
    setBoardsLoading(true);
    setBoardsError(null);
    try {
      const data = await KanbanService.listBoards(currentUserId);
      setBoards(data);
      
      // If a selected board doesn't exist anymore, reset selection
      if (selectedBoardId) {
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

  const applyBoardUpdate = useCallback((board: KanbanBoardType) => {
    console.log('Applying board update:', board); // Add debugging
    setBoards(prev => {
      console.log('Previous boards:', prev); // Add debugging
      const exists = prev.some(item => item.id === board.id);
      const newBoards = exists ? prev.map(item => (item.id === board.id ? board : item)) : [...prev, board];
      console.log('New boards after update:', newBoards); // Add debugging
      return newBoards;
    });
    return board;
  }, []);

  // Event handlers
  const handleBoardSelect = useCallback(async (boardId: string) => {
    setSelectedBoardId(boardId);
    setShowBoardList(false);
    await refreshBoard(boardId);
  }, [refreshBoard]);

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setBoardForm({ name: '', description: '' });
  };

  const startEdit = (board: KanbanBoardType) => {
    setEditingId(board.id);
    setBoardForm({
      name: board.name,
      description: board.description || ''
    });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setBoardForm({ name: '', description: '' });
  };

  const handleCreate = useCallback(async () => {
    if (!boardForm.name.trim()) {
      toast.error('Board name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const board = await KanbanService.createBoard({
        name: boardForm.name.trim(),
        description: boardForm.description.trim() || undefined,
        ownerId: currentUserId
      });
      applyBoardUpdate(board);
      setSelectedBoardId(board.id);
      setShowBoardList(false);
      setBoardForm({ name: '', description: '' });
      setIsCreating(false);
      toast.success('Board created');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create board';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [applyBoardUpdate, currentUserId, boardForm]);

  const handleUpdate = useCallback(async (boardId: string) => {
    if (!boardForm.name.trim()) {
      toast.error('Board name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      // Since updateBoard doesn't exist, we'll update local state
      const updatedBoard = boards.find(b => b.id === boardId);
      if (updatedBoard) {
        const newBoard = {
          ...updatedBoard,
          name: boardForm.name.trim(),
          description: boardForm.description.trim() || undefined,
        };
        
        setBoards(prev => prev.map(board => board.id === boardId ? newBoard : board));
        setEditingId(null);
        setBoardForm({ name: '', description: '' });
        toast.success('Board updated');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update board';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [boards, boardForm]);

  const handleDeleteBoard = useCallback(async (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    const confirmMessage = `Are you sure you want to delete "${board?.name}"?`;
    
    if (!window.confirm(confirmMessage)) return;
    
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
  }, [boards, selectedBoardId]);

  const handleAddColumn = useCallback(async () => {
    if (!selectedBoard) return;
    
    const name = window.prompt('Column name');
    if (!name) return;
    
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
    setCardForm({ id: null, title: '', description: '', columnId: selectedBoard.columns[0].id });
    setIsCardModalOpen(true);
  }, [selectedBoard]);

  const openEditTaskDialog = useCallback((card: { id: string; title: string; description?: string | null }, columnId: string) => {
    setCardForm({ id: card.id, title: card.title, description: card.description ?? '', columnId });
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
      setCardForm({ id: null, title: '', description: '', columnId: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save task';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [applyBoardUpdate, cardForm, currentUserId, selectedBoard]);

  const handleDeleteCard = useCallback(async (cardId: string) => {
    if (!window.confirm('Delete this task?')) return;
    
    console.log('Deleting card:', cardId); // Add debugging
    setIsSubmitting(true);
    try {
      const updatedBoard = await KanbanService.deleteCard(cardId);
      console.log('Updated board after delete:', updatedBoard); // Add debugging
    
      // Make sure we're applying the board update correctly
      applyBoardUpdate(updatedBoard);
    
      // Also force a refresh of the current board to ensure sync
      if (selectedBoard) {
        await refreshBoard(selectedBoard.id);
      }
    
      toast.success('Task deleted');
    } catch (error) {
      console.error('Delete card error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete task');
    } finally {
      setIsSubmitting(false);
    }
  }, [applyBoardUpdate, selectedBoard, refreshBoard]);

  // Handle board click - auto-open board
  const handleBoardClick = (board: KanbanBoardType) => {
    if (editingId === board.id) return; // Don't open if editing
    handleBoardSelect(board.id);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, columnId: string, cardId: string) => {
    setDraggedTask({ columnId, cardId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnterColumn = (columnId: string) => {
    setDragOverColumnId(columnId);
  };

  const handleDragLeaveColumn = () => {
    setDragOverColumnId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    if (!draggedTask || !selectedBoard) return;

    const { columnId: sourceColumnId, cardId } = draggedTask;

    if (sourceColumnId === targetColumnId) {
      setDraggedTask(null);
      return;
    }

    try {
      const board = await KanbanService.updateCard(cardId, { columnId: targetColumnId });
      applyBoardUpdate(board);
      toast.success('Task moved');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to move task';
      toast.error(message);
    } finally {
      setDraggedTask(null);
      setDragOverColumnId(null);
    }
  };

  // Effects
  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  useEffect(() => {
    if (selectedBoardId && !selectedBoard) {
      setSelectedBoardId(null);
      setShowBoardList(true);
    }
  }, [selectedBoardId, selectedBoard]);

  // Loading state
  if (boardsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading boards...</span>
        </div>
      </div>
    );
  }

  // Error state
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

  // Board list view - clean empty state
  if (showBoardList || !selectedBoard) {
    return (
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-2">BackLogs</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Organize your work with visual project boards</p>
            </div>
            <Button
              onClick={startCreate}
              className="gap-2"
              disabled={isCreating}
              size="sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New BackLog</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Create Form */}
        {isCreating && (
          <div className="mb-4 sm:mb-6 p-4 rounded-lg bg-muted/50 border border-border">
            <h3 className="text-lg font-medium mb-3">Create New Board</h3>
            <div className="space-y-3">
              <Input
                placeholder="Enter board name..."
                value={boardForm.name}
                onChange={(e) => setBoardForm(prev => ({ ...prev, name: e.target.value }))}
                className="text-sm"
              />
              <Textarea
                placeholder="Add a description (optional)..."
                value={boardForm.description}
                onChange={(e) => setBoardForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="text-sm resize-none"
              />
              <div className="flex gap-2">
                <Button onClick={handleCreate} size="sm" className="gap-2" disabled={isSubmitting}>
                  <Plus className="h-4 w-4" />
                  {isSubmitting ? 'Creating...' : 'Create Board'}
                </Button>
                <Button variant="outline" size="sm" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Board List or Empty State */}
        {boards.length === 0 && !isCreating ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No backlogs yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first backlog to start organizing your work</p>
            <Button onClick={startCreate} className="gap-2" size="sm">
              <Plus className="h-4 w-4" />
              Create your first backlog
            </Button>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {boards.map((board) => {
              const columnCount = board.columns.length;
              const taskCount = board.columns.reduce((sum, column) => sum + column.cards.length, 0);
              
              return (
                <div
                  key={board.id}
                  className="group flex items-center gap-3 p-3 sm:p-4 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleBoardClick(board)}
                >
                  {editingId === board.id ? (
                    <div 
                      className="w-full space-y-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Input
                        value={boardForm.name}
                        onChange={(e) => setBoardForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Board name"
                        className="text-sm"
                      />
                      <Textarea
                        value={boardForm.description}
                        onChange={(e) => setBoardForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description (optional)"
                        rows={2}
                        className="text-sm resize-none"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate(board.id)} disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Board icon */}
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 flex items-center justify-center shrink-0">
                        <Layout className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base lg:text-lg font-medium truncate">{board.name}</span>
                        </div>
                        {board.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground truncate mt-1">{board.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {new Date(board.createdAt || Date.now()).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">{columnCount} columns</Badge>
                            <Badge variant="outline" className="text-xs">{taskCount} tasks</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - show on hover */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(board);
                          }}
                          className="h-8 w-8 p-0"
                          title="Edit Board"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBoard(board.id);
                          }}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          title="Delete Board"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Board detail view with compact header (unchanged)
  const sortedColumns = [...selectedBoard.columns].sort((a, b) => {
    const aPos = a.position ?? 0;
    const bPos = b.position ?? 0;
    if (aPos === bPos) {
      return a.name.localeCompare(b.name);
    }
    return aPos - bPos;
  });

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Compact Header - Similar to Canvas */}
      <div className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex justify-between items-center p-3 sm:p-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowBoardList(true);
                setSelectedBoardId(null);
              }}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              ← Back
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                {selectedBoard.name}
              </h1>
              {selectedBoard.description && (
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {selectedBoard.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Compact Action Buttons */}
          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddColumn} 
              disabled={isSubmitting}
              className="hidden sm:flex gap-2"
            >
              <Plus className="w-4 h-4" />
              Column
            </Button>
            <Button 
              onClick={openNewTaskDialog} 
              disabled={isSubmitting || !sortedColumns.length}
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Task</span>
            </Button>
            
            {/* Mobile Column Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddColumn} 
              disabled={isSubmitting}
              className="sm:hidden"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-x-auto overflow-y-hidden">
          <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 h-full min-w-max">
            {sortedColumns.length === 0 ? (
              <div className="flex-1 min-w-[280px] flex items-center justify-center">
                <Card className="border-dashed max-w-md">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <Plus className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="font-medium mb-2">No columns yet</h3>
                    <p className="text-sm mb-4">Add your first column to start organizing tasks</p>
                    <Button onClick={handleAddColumn} disabled={isSubmitting} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Column
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              sortedColumns.map((column) => (
                <div
                  key={column.id}
                  className={`flex-shrink-0 w-72 sm:w-80 h-full flex flex-col transition-colors ${
                    dragOverColumnId === column.id ? 'bg-muted/30 rounded-lg p-2' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragEnter={() => handleDragEnterColumn(column.id)}
                  onDragLeave={handleDragLeaveColumn}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-2 py-2 flex-shrink-0">
                    <h3 className="font-medium text-sm sm:text-base truncate">{column.name}</h3>
                    <Badge variant="secondary" className="text-xs">{column.cards.length}</Badge>
                  </div>

                  {/* Cards Container - Takes full remaining height */}
                  <div className="flex-1 overflow-hidden">
                    <div className="h-full space-y-2 overflow-y-auto bg-muted/20 rounded-lg p-2">
                      {column.cards.length === 0 ? (
                        <div className={`text-sm text-muted-foreground p-3 border border-dashed rounded-md transition-colors ${
                          dragOverColumnId === column.id ? 'border-primary text-primary bg-primary/5' : 'border-muted'
                        }`}>
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
                                className="cursor-move hover:shadow-sm transition-shadow group flex-shrink-0"
                                draggable
                                onDragStart={(e) => handleDragStart(e, column.id, card.id)}
                                onDoubleClick={() => openEditTaskDialog(card, column.id)}
                              >
                                <CardContent className="p-3 space-y-2">
                                  <div className="flex justify-between items-start gap-2">
                                    <p className="text-sm font-medium leading-5 flex-1">{card.title}</p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      title="Delete task"
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        handleDeleteCard(card.id); 
                                      }}
                                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                    {card.priorityLabel && (
                                      <Badge
                                        variant="outline"
                                        style={priorityColor ? { borderColor: priorityColor, color: priorityColor } : undefined}
                                        className="text-xs"
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
                </div>
              ))
            )}
          </div>
        </div>
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
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCardModalOpen(false);
                  setCardForm({ id: null, title: '', description: '', columnId: null });
                }} 
                disabled={isSubmitting}
              >
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
}