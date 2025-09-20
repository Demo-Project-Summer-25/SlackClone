import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, Save, Edit, Calendar, User } from 'lucide-react';
import { canvasService, Canvas } from '../../services/canvasService';
import { toast } from 'sonner';
import { VisualCanvas } from './VisualCanvas';

interface CanvasViewerProps {
  canvasId: string;              
  onBack: () => void;
}

export const CanvasViewer: React.FC<CanvasViewerProps> = ({
  canvasId,
  onBack
}) => {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    canvasData: ''
  });

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
      setFormData({
        title: data.title,
        description: data.description || '',
        canvasData: JSON.stringify(data.canvasData, null, 2)    
      });
    } catch (error) {
      toast.error('Failed to load canvas');
      console.error('Error loading canvas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!canvas || !formData.title.trim()) {
      toast.error('Canvas title is required');
      return;
    }

    try {
      let parsedCanvasData;
      try {
        parsedCanvasData = JSON.parse(formData.canvasData);
      } catch {
        toast.error('Invalid JSON in canvas data');
        return;
      }

      const updatedCanvas = await canvasService.updateCanvas(canvas.id, {
        title: formData.title,
        description: formData.description || undefined,
        canvasData: parsedCanvasData                            
      });

      setCanvas(updatedCanvas);
      setIsEditing(false);
      toast.success('Canvas saved successfully');
    } catch (error) {
      toast.error('Failed to save canvas');
      console.error('Error saving canvas:', error);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      if (canvas) {
        setFormData({
          title: canvas.title,
          description: canvas.description || '',
          canvasData: JSON.stringify(canvas.canvasData, null, 2)  
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
      {/* ✅ Header - Removed Edit Button */}
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
              <p className="text-sm text-muted-foreground">
                Visual workspace editor
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          
          {/* ✅ Visual Canvas Editor - Now at the top */}
          <Card className="bg-card/60 backdrop-blur border-border">
            <CardContent className="p-0">
              <div className="rounded-lg overflow-hidden">
                <VisualCanvas />
              </div>
            </CardContent>
          </Card>

          {/* ✅ Canvas Details - Edit button moved here */}
          <Card className="bg-card/60 backdrop-blur border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-foreground flex items-center justify-between">
                Canvas Information
                <div className="flex gap-2">
                  {/* ✅ Edit button moved to this section */}
                  <Button onClick={toggleEdit} variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    {isEditing ? 'Cancel' : 'Edit Info'}
                  </Button>
                  {isEditing && (
                    <Button onClick={handleSave} size="sm" className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
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
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Add a description for this canvas..."
                      rows={3}
                      className="bg-background resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{canvas.title}</h3>
                    {canvas.description ? (
                      <p className="text-muted-foreground mt-1">{canvas.description}</p>
                    ) : (
                      <p className="text-muted-foreground mt-1 italic">No description provided</p>
                    )}
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