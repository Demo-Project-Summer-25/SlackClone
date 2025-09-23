import React, { useState } from 'react';
import { CanvasList } from './CanvasList';
import { CanvasViewer } from './CanvasViewer';
import { Canvas } from '../../services/canvasService';
import { useAuth } from '../../hooks/useAuth';

export const CanvasPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedCanvasId, setSelectedCanvasId] = useState<string | null>(null);

  // Use the actual user ID from auth, fallback to Jennifer's ID
  const currentUserId = currentUser?.id || '68973614-94db-4f98-9729-0712e0c5c0fa';

  const handleSelectCanvas = (canvas: Canvas) => {
    setSelectedCanvasId(canvas.id);
  };

  const handleBackToList = () => {
    setSelectedCanvasId(null);
  };

  const handleCreateCanvas = () => {
    // Refresh list or other actions
  };

  return (
    <div className="h-full bg-background">
      {selectedCanvasId ? (
        <CanvasViewer 
          canvasId={selectedCanvasId} 
          onBack={handleBackToList}
        />
      ) : (
        <CanvasList 
          onSelectCanvas={handleSelectCanvas}
          onCreateCanvas={handleCreateCanvas}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};