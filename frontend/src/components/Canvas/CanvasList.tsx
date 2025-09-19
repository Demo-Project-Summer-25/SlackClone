import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { canvasService, Canvas } from '../../services/canvasService';
import { toast } from 'sonner'; // Changed from react-hot-toast

interface CanvasListProps {
  onSelectCanvas?: (canvas: Canvas) => void;
  onCreateCanvas?: () => void;
}

export const CanvasList: React.FC<CanvasListProps> = ({
  onSelectCanvas,
  onCreateCanvas
}) => {
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
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
    if (!formData.name.trim()) {
      toast.error('Canvas name is required');
      return;
    }

    try {
      const newCanvas = await canvasService.createCanvas({
        name: formData.name,
        description: formData.description || undefined,
        canvasData: {}
      });
      setCanvases(prev => [newCanvas, ...prev]);
      setFormData({ name: '', description: '' });
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
    if (!formData.name.trim()) {
      toast.error('Canvas name is required');
      return;
    }

    try {
      const updatedCanvas = await canvasService.updateCanvas(id, {
        name: formData.name,
        description: formData.description || undefined
      });
      setCanvases(prev => prev.map(canvas =>
        canvas.id === id ? updatedCanvas : canvas
      ));
      setEditingId(null);
      setFormData({ name: '', description: '' });
      toast.success('Canvas updated');
    } catch (error) {
      toast.error('Failed to update canvas');
      console.error('Error updating canvas:', error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
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
      name: canvas.name,
      description: canvas.description || ''
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ name: '', description: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Canvases</h2>
        <Button
          onClick={startCreate}
          className="flex items-center gap-2"
          disabled={isCreating}
        >
          <Plus className="h-4 w-4" />
          Create Canvas
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Canvas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Canvas name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            <Textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreate}>Create</Button>
              <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Canvas List */}
      <div className="space-y-3">
        {canvases.map((canvas) => (
          <Card key={canvas.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {editingId === canvas.id ? (
                <div className="space-y-4">
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Canvas name"
                  />
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description (optional)"
                    rows={3}
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
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{canvas.name}</h3>
                    {canvas.description && (
                      <p className="text-gray-600 mt-1">{canvas.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Created: {new Date(canvas.createdTimestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {onSelectCanvas && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSelectCanvas(canvas)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(canvas)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(canvas.id, canvas.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {canvases.length === 0 && !isCreating && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">No canvases found</p>
            <Button onClick={startCreate}>Create your first canvas</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
