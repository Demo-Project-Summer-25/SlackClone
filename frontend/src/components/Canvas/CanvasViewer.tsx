import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, Edit, Save, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';
import { VisualCanvas } from './VisualCanvas';
import { canvasService } from '../../services/canvasService';

interface CanvasViewerProps {
  canvasId: string;
  onBack: () => void;
}

export const CanvasViewer: React.FC<CanvasViewerProps> = ({
  canvasId,
  onBack
}) => {
  const [canvas, setCanvas] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [canvasData, setCanvasData] = useState<{ nodes: any[], edges: any[] } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (canvasId) {
      loadCanvas();
    }
  }, [canvasId]);

  const loadCanvas = async () => {
    if (!canvasId) return;

    try {
      setLoading(true);
      const data = await canvasService.getCanvas(canvasId);
      setCanvas(data);
      
      // Set current canvas ID for VisualCanvas to use
      localStorage.setItem('current-canvas-id', canvasId);
      
      setFormData({
        title: data.title,
        description: '', // Backend doesn't support description yet
      });
      
      // Try to load saved canvas data from localStorage
      const savedData = localStorage.getItem(`canvas-data-${canvasId}`);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setCanvasData({ nodes: parsed.nodes, edges: parsed.edges });
        } catch (error) {
          console.error('Failed to parse saved canvas data');
        }
      }
      
    } catch (error) {
      toast.error('Failed to load canvas');
      console.error('Error loading canvas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInfo = async () => {
    if (!canvas || !formData.title.trim()) {
      toast.error('Canvas title is required');
      return;
    }

    try {
      setIsSaving(true);
      const updatedCanvas = await canvasService.updateCanvas(canvas.id, {
        title: formData.title,
        // Remove description since backend doesn't support it
      });

      setCanvas(updatedCanvas);
      setIsEditing(false);
      toast.success('Canvas info saved successfully');
    } catch (error) {
      toast.error('Failed to save canvas info');
      console.error('Error saving canvas info:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCanvas = useCallback(async () => {
    if (!canvas) {
      toast.error('No canvas to save');
      return;
    }

    try {
      setIsSaving(true);
      
      // Get current data from temp storage
      const currentData = localStorage.getItem(`canvas-temp-${canvas.id}`);
      if (!currentData) {
        // If no temp data, create a minimal save from current state
        const defaultData = {
          nodes: [],
          edges: [],
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem(`canvas-data-${canvas.id}`, JSON.stringify(defaultData));
        toast.success('Canvas saved successfully');
      } else {
        // Save temp data to permanent storage
        localStorage.setItem(`canvas-data-${canvas.id}`, currentData);
        toast.success('Canvas saved successfully');
      }
      
    } catch (error) {
      toast.error('Failed to save canvas');
      console.error('Error saving canvas:', error);
    } finally {
      setIsSaving(false);
    }
  }, [canvas]);

  const toggleEdit = () => {
    if (isEditing) {
      if (canvas) {
        setFormData({
          title: canvas.title,
          description: canvas.description || '',
        });
      }
    }
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading canvas...</p>
        </div>
      </div>
    );
  }

  if (!canvas) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="rounded-full bg-muted p-4 mx-auto mb-4 w-fit">
            <ArrowLeft className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Canvas not found</h3>
          <p className="text-muted-foreground mb-4">
            The canvas you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header with Save Button */}
      <div className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {canvas.title}
              </h1>
            </div>
          </div>
          
          {/* Save and Edit Buttons in Header */}
          <div className="flex gap-2">
            <Button 
              onClick={handleSaveCanvas} 
              variant="outline" 
              size="sm" 
              className="gap-2"
              disabled={isSaving} // Remove the !canvasData condition
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Canvas'}
            </Button>
            <Button onClick={toggleEdit} variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              {isEditing ? 'Cancel' : 'Edit Info'}
            </Button>
            {isEditing && (
              <Button 
                onClick={handleSaveInfo} 
                size="sm" 
                className="gap-2"
                disabled={isSaving}
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Info'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          
          {/* Visual Canvas Editor */}
          <Card className="bg-card/60 backdrop-blur border-border">
            <CardContent className="p-0">
              <div className="rounded-lg overflow-hidden">
                <VisualCanvas 
                  onSave={handleSaveCanvas} 
                  initialData={canvasData}
                />
              </div>
            </CardContent>
          </Card>

          {/* Canvas Details */}
          <Card className="bg-card/60 backdrop-blur border-border">
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Canvas title"
                      className="bg-background"
                    />
                  </div>
                  {/* Remove description field since backend doesn't support it yet */}
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{canvas.title}</h3>
                    {/* Remove description display since backend doesn't support it */}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Created {new Date(canvas.createdTimestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Updated {new Date(canvas.updatedTimestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};