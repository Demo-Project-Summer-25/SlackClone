import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Plus, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { canvasService, Canvas } from '../../services/canvasService';
import { toast } from 'sonner';

interface CanvasListProps {
  onSelectCanvas?: (canvas: Canvas) => void;
  onCreateCanvas?: () => void;
  currentUserId: string;
}

export const CanvasList: React.FC<CanvasListProps> = ({
  onSelectCanvas,
  onCreateCanvas,
  currentUserId
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

      if (onCreateCanvas) {
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
        description: formData.description || undefined
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
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Canvases</h1>
            <p className="text-sm text-muted-foreground">
              Create and manage your visual workspaces
            </p>
          </div>
          <Button
            onClick={startCreate}
            className="gap-2"
            disabled={isCreating}
          >
            <Plus className="h-4 w-4" />
            New Canvas
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Create Form */}
          {isCreating && (
            <Card className="border-primary/20 bg-card/60 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Create New Canvas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    placeholder="Enter canvas title..."
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-background"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Add a description (optional)..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="bg-background resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Canvas
                  </Button>
                  <Button variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Canvas Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {canvases.map((canvas) => (
              <Card 
                key={canvas.id} 
                className="group hover:shadow-lg hover:border-primary/20 transition-all duration-200 bg-card/60 backdrop-blur cursor-pointer"
              >
                <CardContent className="p-0">
                  {editingId === canvas.id ? (
                    <div className="p-4 space-y-4">
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Canvas title"
                        className="bg-background"
                      />
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description (optional)"
                        rows={2}
                        className="bg-background resize-none"
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
                    <div className="relative">
                      {/* Canvas Preview Area */}

                      {/* Canvas Info */}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-foreground line-clamp-1 flex-1">
                            {canvas.title}
                          </h3>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {onSelectCanvas && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectCanvas(canvas);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                startEdit(canvas);
                              }}
                              className="h-8 w-8 p-0"
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
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {canvas.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {canvas.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(canvas.createdTimestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {canvases.length === 0 && !isCreating && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No canvases yet
              </h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Create your first canvas to start visualizing and organizing your ideas
              </p>
              <Button onClick={startCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Create your first canvas
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
