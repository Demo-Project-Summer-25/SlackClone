import React, { useState } from 'react';
import { CanvasList } from './CanvasList';
import { CanvasViewer } from './CanvasViewer';
import { Canvas } from '../../services/canvasService';

export const CanvasPage: React.FC = () => {
  const [selectedCanvasId, setSelectedCanvasId] = useState<string | null>(null);  

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
    <div className="container mx-auto p-6">
      {selectedCanvasId ? (
        <CanvasViewer 
          canvasId={selectedCanvasId} 
          onBack={handleBackToList}
        />
      ) : (
        <CanvasList 
          onSelectCanvas={handleSelectCanvas}
          onCreateCanvas={handleCreateCanvas}
        />
      )}
    </div>
  );
};