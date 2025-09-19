import React, { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  ConnectionMode,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Save, Download, Upload, Trash2 } from 'lucide-react';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 250, y: 25 },
    data: { label: 'Farmer' },
    style: { background: '#1e3a8a', color: 'white', border: '1px solid #1e40af' },
  },
  {
    id: '2',
    type: 'default',
    position: { x: 100, y: 125 },
    data: { label: 'Vehicle' },
    style: { background: '#1e3a8a', color: 'white', border: '1px solid #1e40af' },
  },
  {
    id: '3',
    type: 'default',
    position: { x: 400, y: 125 },
    data: { label: 'Crop' },
    style: { background: '#1e3a8a', color: 'white', border: '1px solid #1e40af' },
  },
];

const initialEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2',
    style: { stroke: '#94a3b8', strokeWidth: 2 },
    animated: true,
  },
  { 
    id: 'e1-3', 
    source: '1', 
    target: '3',
    style: { stroke: '#94a3b8', strokeWidth: 2 },
    animated: true,
  },
];

// Inner component that has access to useReactFlow
const CanvasFlow: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [newNodeName, setNewNodeName] = useState('');
  const [nodeCounter, setNodeCounter] = useState(4);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { getNodes, getEdges } = useReactFlow();

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge({
      ...params,
      style: { stroke: '#94a3b8', strokeWidth: 2 },
      animated: true,
    }, eds)),
    [setEdges]
  );

  // Handle key presses for deletion
  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      const selectedNodes = getNodes().filter(node => node.selected);
      const selectedEdges = getEdges().filter(edge => edge.selected);
      
      if (selectedNodes.length > 0) {
        setNodes((nds) => nds.filter(node => !node.selected));
      }
      
      if (selectedEdges.length > 0) {
        setEdges((eds) => eds.filter(edge => !edge.selected));
      }
    }
  }, [setNodes, setEdges, getNodes, getEdges]);

  // Delete selected elements manually
  const deleteSelected = useCallback(() => {
    const selectedNodes = getNodes().filter(node => node.selected);
    const selectedEdges = getEdges().filter(edge => edge.selected);
    
    if (selectedNodes.length > 0) {
      setNodes((nds) => nds.filter(node => !node.selected));
    }
    
    if (selectedEdges.length > 0) {
      setEdges((eds) => eds.filter(edge => !edge.selected));
    }
  }, [setNodes, setEdges, getNodes, getEdges]);

  // Add new node
  const addNode = useCallback(() => {
    if (!newNodeName.trim()) return;

    const newNode: Node = {
      id: nodeCounter.toString(),
      type: 'default',
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      data: { label: newNodeName },
      style: { 
        background: '#1e3a8a', 
        color: 'white', 
        border: '1px solid #1e40af',
        borderRadius: '8px',
        padding: '10px',
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeCounter(prev => prev + 1);
    setNewNodeName('');
  }, [newNodeName, nodeCounter, setNodes]);

  // Save canvas data
  const saveCanvas = useCallback(() => {
    const canvasData = {
      nodes: nodes,
      edges: edges,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Saving canvas:', canvasData);
    localStorage.setItem('canvas-data', JSON.stringify(canvasData));
    alert('Canvas saved to localStorage!');
  }, [nodes, edges]);

  // Load canvas data
  const loadCanvas = useCallback(() => {
    const saved = localStorage.getItem('canvas-data');
    if (saved) {
      const canvasData = JSON.parse(saved);
      setNodes(canvasData.nodes || []);
      setEdges(canvasData.edges || []);
      alert('Canvas loaded from localStorage!');
    }
  }, [setNodes, setEdges]);

  // Export canvas as JSON
  const exportCanvas = useCallback(() => {
    const canvasData = {
      nodes: nodes,
      edges: edges,
      timestamp: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(canvasData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'canvas-export.json';
    link.click();
    
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  return (
    <div 
      style={{ width: '100%', height: '600px', position: 'relative' }}
      onKeyDown={onKeyDown}  
      tabIndex={0}         
      ref={reactFlowWrapper}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-gray-50"
        deleteKeyCode={['Delete', 'Backspace']}  
        multiSelectionKeyCode={['Meta', 'Ctrl']} 
        selectionOnDrag={true}                   
      >
        <Controls />
        <MiniMap 
          nodeColor="#1e3a8a"
          maskColor="rgba(0, 0, 0, 0.2)"
        />
        <Background 
          variant="dots" 
          gap={16} 
          size={1} 
          color="#e2e8f0"
        />
        
        {/* Enhanced Control Panel */}
        <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-lg">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Canvas Tools</h3>
            
            {/* Add Node */}
            <div className="flex gap-2">
              <Input
                placeholder="Node name"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addNode()}
                className="h-8 text-xs"
              />
              <Button size="sm" onClick={addNode}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={saveCanvas}>
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={loadCanvas}>
                <Upload className="h-3 w-3 mr-1" />
                Load
              </Button>
              <Button size="sm" variant="outline" onClick={exportCanvas}>
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={deleteSelected}
                title="Delete selected nodes/edges"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
            
            {/* Instructions */}
            <div className="text-xs text-gray-500 space-y-1">
              <div>Nodes: {nodes.length} | Edges: {edges.length}</div>
              <div>• Click to select • Drag to move</div>
              <div>• Delete key or Delete button</div>
              <div>• Ctrl/Cmd + click for multi-select</div>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

// Main component wrapped with ReactFlowProvider
export const VisualCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <CanvasFlow />
    </ReactFlowProvider>
  );
};