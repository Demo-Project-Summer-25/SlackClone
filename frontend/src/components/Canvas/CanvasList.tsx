import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Plus, Edit, Trash2, Eye, Calendar, Pen } from 'lucide-react';
import { canvasService, Canvas } from '../../services/canvasService';
import { toast } from 'sonner';

interface CanvasListProps {
  onSelectCanvas?: (canvas: Canvas) => void;
  onCreateCanvas?: () => void;
  currentUserId: string;
  // ✅ Add prop to detect split screen mode
  isInSplitMode?: boolean;
}

export const CanvasList: React.FC<CanvasListProps> = ({
  onSelectCanvas,
  onCreateCanvas,
  currentUserId,
  isInSplitMode = false
}) => {
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    loadCanvases();
  }, []);

  const loadCanvases = async () => {
    try {
      setLoading(true);
      const data = await canvasService.getCanvases();
      setCanvases(data);
    } catch (error) {
      toast.error('Failed to load canvases');
      console.error('Error loading canvases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      toast.error('Canvas title is required');
      return;
    }

    try {
      const newCanvas = await canvasService.createCanvas({
        title: formData.title,
        description: formData.description || undefined,
        canvasData: {}
      }, currentUserId);
      setCanvases(prev => [newCanvas, ...prev]);
      setFormData({ title: '', description: '' });
      setIsCreating(false);
      toast.success('Canvas created');

      // ✅ Auto-open newly created canvas
      if (onSelectCanvas) {
        onSelectCanvas(newCanvas);
      } else if (onCreateCanvas) {
        onCreateCanvas();
      }
    } catch (error) {
      toast.error('Failed to create canvas');
      console.error('Error creating canvas:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.title.trim()) {
      toast.error('Canvas title is required');
      return;
    }

    try {
      const updatedCanvas = await canvasService.updateCanvas(id, {
        title: formData.title,
       // description: formData.description || undefined
      });
      setCanvases(prev => prev.map(canvas =>
        canvas.id === id ? updatedCanvas : canvas
      ));
      setEditingId(null);
      setFormData({ title: '', description: '' });
      toast.success('Canvas updated');
    } catch (error) {
      toast.error('Failed to update canvas');
      console.error('Error updating canvas:', error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await canvasService.deleteCanvas(id);
      setCanvases(prev => prev.filter(canvas => canvas.id !== id));
      toast.success('Canvas deleted');
    } catch (error) {
      toast.error('Failed to delete canvas');
      console.error('Error deleting canvas:', error);
    }
  };

  const startEdit = (canvas: Canvas) => {
    setEditingId(canvas.id);
    setFormData({
      title: canvas.title,
      description: canvas.description || ''
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({ title: '', description: '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ title: '', description: '' });
  };

  // ✅ Handle canvas card click - auto-open canvas
  const handleCanvasClick = (canvas: Canvas) => {
    if (editingId === canvas.id) return; // Don't open if editing
    if (onSelectCanvas) {
      onSelectCanvas(canvas);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading canvases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-2">WireFrame</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Create and manage UMLs and data models</p>
          </div>
          <Button
            onClick={startCreate}
            className="gap-2"
            disabled={isCreating}
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Canvas</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* Create Form */}
      {isCreating && (
        <div className="mb-4 sm:mb-6 p-4 rounded-lg bg-muted/50 border border-border">
          <h3 className="text-lg font-medium mb-3">Create New Canvas</h3>
          <div className="space-y-3">
            <Input
              placeholder="Enter canvas title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="text-sm"
            />
            <Textarea
              placeholder="Add a description (optional)..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="text-sm resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={handleCreate} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Canvas
              </Button>
              <Button variant="outline" size="sm" onClick={cancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Canvas List */}
      {canvases.length === 0 && !isCreating ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No wireframes yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Create your first wirefram to start visualizing your ideas</p>
          <Button onClick={startCreate} className="gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Create your first canvas
          </Button>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {canvases.map((canvas) => (
            <div
              key={canvas.id}
              className="group flex items-center gap-3 p-3 sm:p-4 rounded-lg hover:bg-accent transition-colors cursor-pointer"
              onClick={() => handleCanvasClick(canvas)}
            >
              {editingId === canvas.id ? (
                <div 
                  className="w-full space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Canvas title"
                    className="text-sm"
                  />
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description (optional)"
                    rows={2}
                    className="text-sm resize-none"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdate(canvas.id)}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Canvas icon */}
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700/50 flex items-center justify-center shrink-0">
                    <Pen className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base lg:text-lg font-medium truncate">{canvas.title}</span>
                    </div>
                    {canvas.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground truncate mt-1">{canvas.description}</p>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(canvas.createdTimestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons - show on hover */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(canvas);
                      }}
                      className="h-8 w-8 p-0"
                      title="Edit Canvas"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(canvas.id, canvas.title);
                      }}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      title="Delete Canvas"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};