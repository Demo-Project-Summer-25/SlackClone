import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, Save, Edit } from 'lucide-react';
import { canvasService, Canvas } from '../../services/canvasService';
import { toast } from 'sonner';

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
    name: '',
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
        name: data.name,
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
    if (!canvas || !formData.name.trim()) {
      toast.error('Canvas name is required');
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
        name: formData.name,
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
          name: canvas.name,
          description: canvas.description || '',
          canvasData: JSON.stringify(canvas.canvasData, null, 2)  
        });
      }
    }
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!canvas) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Canvas not found</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Edit Canvas' : 'View Canvas'}
          </h2>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={toggleEdit}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={toggleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Canvas Details */}
      <Card>
        <CardHeader>
          <CardTitle>Canvas Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Canvas name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description (optional)"
                  rows={3}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="font-semibold text-lg">{canvas.name}</h3>
                {canvas.description && (
                  <p className="text-gray-600 mt-1">{canvas.description}</p>
                )}
              </div>
              <div className="text-sm text-gray-500">
                <p>Created: {new Date(canvas.createdTimestamp).toLocaleString()}</p>   
                <p>Updated: {new Date(canvas.updatedTimestamp).toLocaleString()}</p>   
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Canvas Data */}
      <Card>
        <CardHeader>
          <CardTitle>Canvas Data</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div>
              <label className="block text-sm font-medium mb-2">
                Canvas Data (JSON)
              </label>
              <Textarea
                value={formData.canvasData}
                onChange={(e) => setFormData(prev => ({ ...prev, canvasData: e.target.value }))}
                className="font-mono text-sm"
                rows={15}
                placeholder="Enter canvas data as JSON"
              />
            </div>
          ) : (
            <div>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(canvas.canvasData, null, 2)}                          
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};