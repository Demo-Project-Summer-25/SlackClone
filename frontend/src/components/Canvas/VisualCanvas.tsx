import React, { useCallback, useState, useRef, memo, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  ConnectionMode,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
  NodeProps,
  NodeResizer,
  EdgeProps,
  getSmoothStepPath,
} from 'reactflow';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Save, Download, Upload, Trash2, Info } from 'lucide-react';
import { useTheme } from '../ThemeProvider'; // ✅ Import useTheme hook
import 'reactflow/dist/style.css';

// ✅ Helper function to determine if we're in dark mode
const useIsDarkMode = () => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateDarkMode = () => {
      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(systemDark);
      } else {
        setIsDark(theme === 'dark');
      }
    };

    updateDarkMode();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        setIsDark(mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return isDark;
};

// Relationship types with solid colors that work in both light and dark mode
const RELATIONSHIP_TYPES = {
  default: { 
    label: 'Basic', 
    color: '#000000', // Black in light mode
    darkColor: '#ffffff', // White in dark mode
    marker: 'arrow'
  },
  'one-to-many': { 
    label: '1:M', 
    color: '#3b82f6', // Blue
    darkColor: '#60a5fa',
    marker: 'one-to-many'
  },
  'many-to-one': { 
    label: 'M:1', 
    color: '#10b981', // Green
    darkColor: '#34d399',
    marker: 'many-to-one'
  },
  'many-to-many': { 
    label: 'M:M', 
    color: '#ef4444', // Red
    darkColor: '#f87171',
    marker: 'many-to-many'
  },
  inheritance: { 
    label: 'Inherits', 
    color: '#8b5cf6', // Purple
    darkColor: '#a78bfa',
    marker: 'inheritance'
  },
  composition: { 
    label: 'Composed', 
    color: '#f59e0b', // Orange
    darkColor: '#fbbf24',
    marker: 'composition'
  },
  custom: { 
    label: 'Custom', 
    color: '#6b7280', // Gray
    darkColor: '#9ca3af',
    marker: 'arrow'
  },
};

// ✅ Updated Custom Edge Component - single label only
const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
}) => {
  const isDark = useIsDarkMode();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 20,
  });

  const relationshipType = data?.relationshipType || 'default';
  const config = RELATIONSHIP_TYPES[relationshipType as keyof typeof RELATIONSHIP_TYPES];
  const strokeColor = isDark ? config?.darkColor : config?.color;

  // ✅ Get line style based on relationship type
  const getLineStyle = (type: string) => {
    switch (type) {
      case 'one-to-many':
        return { strokeWidth: 3, strokeDasharray: 'none' };
      case 'many-to-one':
        return { strokeWidth: 3, strokeDasharray: 'none' };
      case 'many-to-many':
        return { strokeWidth: 4, strokeDasharray: 'none' };
      case 'inheritance':
        return { strokeWidth: 2, strokeDasharray: '8,4' };
      case 'composition':
        return { strokeWidth: 3, strokeDasharray: '12,4,4,4' };
      default:
        return { strokeWidth: 2, strokeDasharray: 'none' };
    }
  };

  // ✅ Get relationship indicator text
  const getRelationshipText = (type: string) => {
    switch (type) {
      case 'one-to-many': return '1 → M';
      case 'many-to-one': return 'M → 1';
      case 'many-to-many': return 'M ↔ M';
      case 'inheritance': return 'extends';
      case 'composition': return 'has';
      case 'custom': return data?.label || 'custom'; // ✅ Use custom label for custom type
      default: return ''; // ✅ Use custom label for basic connections
    }
  };

  const lineStyle = getLineStyle(relationshipType);
  const relationshipText = getRelationshipText(relationshipType);

  return (
    <>
      {/* Main connection line */}
      <path
        id={id}
        style={{
          ...style,
          stroke: strokeColor || '#000000',
          strokeWidth: lineStyle.strokeWidth,
          strokeDasharray: lineStyle.strokeDasharray,
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />
      
      {/* ✅ Single relationship label - rounded pill style */}
      {relationshipText && (
        <>
          <rect
            x={labelX - (relationshipText.length * 3.5)}
            y={labelY - 10}
            width={relationshipText.length * 7}
            height="20"
            fill={isDark ? '#1f2937' : '#ffffff'}
            stroke={strokeColor}
            strokeWidth="1"
            rx="10"
            ry="10"
            opacity="0.95"
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={strokeColor}
            style={{ fontSize: '11px', fontWeight: 'bold' }}
          >
            {relationshipText}
          </text>
        </>
      )}
    </>
  );
};

// ✅ Updated Custom resizable node component with proper theme colors
const EditableNode = memo(({ data, id, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.label);
  const { setNodes } = useReactFlow();
  const isDark = useIsDarkMode(); // ✅ Use the proper hook

  // Add this effect to communicate editing state
  useEffect(() => {
    // Add a data attribute to track editing state
    const element = document.querySelector(`[data-id="${id}"]`);
    if (element) {
      element.setAttribute('data-editing', isEditing.toString());
    }
  }, [isEditing, id]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = () => {
    setIsEditing(false);
    // Update the node content
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: content } } : node
      )
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setContent(data.label); // Reset to original
      setIsEditing(false);
    }
    // Don't submit on Enter - let users add new lines
    // They can click outside or press Escape to finish editing
  };

  return (
    <div 
      className={`relative rounded-lg p-3 min-w-[120px] min-h-[60px] border-2 ${
        selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      onDoubleClick={handleDoubleClick}
      style={{ 
        fontSize: '14px', 
        fontWeight: '500',
        // ✅ Force colors based on theme
        backgroundColor: isDark ? '#ffffff' : '#000000',
        color: isDark ? '#000000' : '#ffffff',
        borderColor: isDark ? '#ffffff' : '#000000',
      }}
    >
      {/* NodeResizer - only shows when selected */}
      <NodeResizer 
        color="#3b82f6" 
        isVisible={selected}
        minWidth={120}
        minHeight={60}
      />

      {/* Node content */}
      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSubmit}
          className="bg-transparent border-none outline-none w-full h-full resize-none"
          style={{
            color: isDark ? '#000000' : '#ffffff', // ✅ Force text color
            fontSize: '14px', 
            fontWeight: '500',
            minHeight: '40px'
          }}
          autoFocus
          placeholder="Type here... (Esc to cancel)"
        />
      ) : (
        <div 
          className="whitespace-pre-wrap break-words h-full flex items-center"
          style={{
            color: isDark ? '#000000' : '#ffffff' // ✅ Force text color
          }}
        >
          {data.label || 'Double-click to edit'}
        </div>
      )}

      {/* ✅ Fixed Connection handles with unique IDs and both source/target on each side */}
      {/* Top handles */}
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="w-3 h-3 !bg-blue-400 !border-2 !border-white hover:!bg-blue-600 transition-colors"
        style={{ left: '25%' }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-3 h-3 !bg-green-400 !border-2 !border-white hover:!bg-green-600 transition-colors"
        style={{ left: '75%' }}
      />
      
      {/* Bottom handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="w-3 h-3 !bg-blue-400 !border-2 !border-white hover:!bg-blue-600 transition-colors"
        style={{ left: '25%' }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="w-3 h-3 !bg-green-400 !border-2 !border-white hover:!bg-green-600 transition-colors"
        style={{ left: '75%' }}
      />
      
      {/* Left handles */}
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="w-3 h-3 !bg-blue-400 !border-2 !border-white hover:!bg-blue-600 transition-colors"
        style={{ top: '25%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-3 h-3 !bg-green-400 !border-2 !border-white hover:!bg-green-600 transition-colors"
        style={{ top: '75%' }}
      />
      
      {/* Right handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="w-3 h-3 !bg-blue-400 !border-2 !border-white hover:!bg-blue-600 transition-colors"
        style={{ top: '25%' }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="w-3 h-3 !bg-green-400 !border-2 !border-white hover:!bg-green-600 transition-colors"
        style={{ top: '75%' }}
      />
    </div>
  );
});

EditableNode.displayName = 'EditableNode';

// Define custom node and edge types
const nodeTypes = {
  editable: EditableNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'editable',
    position: { x: 250, y: 25 },
    data: { label: 'User\n• ID: Primary Key\n• Name: String\n• Email: String' },
    style: { width: 180, height: 100 },
  },
  {
    id: '2',
    type: 'editable',
    position: { x: 100, y: 200 },
    data: { label: 'Orders\n• ID: Primary Key\n• UserID: Foreign Key\n• Date: DateTime' },
    style: { width: 160, height: 100 },
  },
  {
    id: '3',
    type: 'editable',
    position: { x: 400, y: 200 },
    data: { label: 'Products\n• ID: Primary Key\n• Name: String\n• Price: Decimal' },
    style: { width: 160, height: 100 },
  },
];

const initialEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2',
    sourceHandle: 'bottom-source',
    targetHandle: 'top-target',
    type: 'custom',
    data: { 
      relationshipType: 'one-to-many',
      label: 'places'
    },
    style: { strokeWidth: 2, stroke: '#3b82f6' },
    animated: false,
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3',
    sourceHandle: 'right-source',
    targetHandle: 'left-target',
    type: 'custom',
    data: { 
      relationshipType: 'many-to-many',
      label: 'contains'
    },
    style: { strokeWidth: 2, stroke: '#ef4444' },
    animated: false,
  },
];

// Inner component that has access to useReactFlow
const CanvasFlow: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [newNodeName, setNewNodeName] = useState('');
  const [nodeCounter, setNodeCounter] = useState(4);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<{
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  } | null>(null);
  const [customLabel, setCustomLabel] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { getNodes, getEdges } = useReactFlow();
  const isDark = useIsDarkMode(); // ✅ Use the proper hook

  const onConnect = useCallback(
    (params: any) => {
      // Store the pending connection with handle information
      setPendingConnection({
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      });
    },
    []
  );

  const handleRelationshipSelect = useCallback((relationshipType: string) => {
    if (pendingConnection) {
      // If custom is selected, show the input field
      if (relationshipType === 'custom') {
        setShowCustomInput(true);
        return;
      }

      const config = RELATIONSHIP_TYPES[relationshipType as keyof typeof RELATIONSHIP_TYPES];
      const strokeColor = isDark ? config.darkColor : config.color;
      
      const newEdge: Edge = {
        id: `e${Date.now()}`,
        source: pendingConnection.source,
        target: pendingConnection.target,
        sourceHandle: pendingConnection.sourceHandle,
        targetHandle: pendingConnection.targetHandle,
        type: 'custom',
        data: { 
          relationshipType,
          label: config.label
        },
        style: { 
          strokeWidth: 2,
          stroke: strokeColor
        },
        animated: false,
      };
      
      setEdges((eds) => [...eds, newEdge]);
      setPendingConnection(null);
    }
  }, [pendingConnection, setEdges, isDark]);

  const handleCustomRelationship = useCallback(() => {
    if (pendingConnection && customLabel.trim()) {
      const config = RELATIONSHIP_TYPES.custom;
      const strokeColor = isDark ? config.darkColor : config.color;
      
      const newEdge: Edge = {
        id: `e${Date.now()}`,
        source: pendingConnection.source,
        target: pendingConnection.target,
        sourceHandle: pendingConnection.sourceHandle,
        targetHandle: pendingConnection.targetHandle,
        type: 'custom',
        data: { 
          relationshipType: 'custom',
          label: customLabel.trim()
        },
        style: { 
          strokeWidth: 2,
          stroke: strokeColor
        },
        animated: false,
      };
      
      setEdges((eds) => [...eds, newEdge]);
      setPendingConnection(null);
      setShowCustomInput(false);
      setCustomLabel('');
    }
  }, [pendingConnection, customLabel, setEdges, isDark]);

  const cancelConnection = useCallback(() => {
    setPendingConnection(null);
    setShowCustomInput(false);
    setCustomLabel('');
  }, []);

  // Enhanced deletion - handles both nodes and edges
  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Check if any node is in edit mode
    const editingNodes = document.querySelectorAll('[data-editing="true"]');
    
    if ((event.key === 'Delete' || event.key === 'Backspace') && editingNodes.length === 0) {
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
      type: 'editable',
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      data: { label: newNodeName },
      style: { width: 140, height: 70 },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeCounter(prev => prev + 1);
    setNewNodeName('');
  }, [newNodeName, nodeCounter, setNodes]);

  // Clear all nodes and edges
  const clearCanvas = useCallback(() => {
    if (confirm('Are you sure you want to clear the entire canvas? This cannot be undone.')) {
      setNodes([]);
      setEdges([]);
    }
  }, [setNodes, setEdges]);

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
      className="bg-background border border-border rounded-lg overflow-hidden"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-background"
        deleteKeyCode={['Delete', 'Backspace']}  
        multiSelectionKeyCode={['Meta', 'Ctrl']} 
        selectionOnDrag={true}
        selectNodesOnDrag={false}
      >
        <Controls className="bg-card border-border" />
        <MiniMap 
          nodeColor="#000000"
          maskColor="rgba(255, 255, 255, 0.8)"
          className="bg-card border border-border rounded-lg dark:[&_.react-flow__minimap-node]:!fill-white dark:[&_.react-flow__minimap-mask]:!fill-black/80"
        />
        <Background 
          variant={BackgroundVariant.Dots}
          gap={16} 
          size={1} 
          color="#666666"
          className="dark:[&>*]:!stroke-gray-400"
        />
        
        {/* Main Control Panel - Now fully opaque */}
        <Panel position="top-left" className="bg-card border border-border rounded-lg shadow-lg">
          <div className="space-y-3 p-3">
            {/* Quick Add Node */}
            <div className="flex gap-2">
              <Input
                placeholder="Add new entity..."
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addNode()}
                className="h-8 text-xs bg-background border-border flex-1"
              />
              <Button size="sm" onClick={addNode} className="h-8 px-2">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Primary Actions */}
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={deleteSelected}
                title="Delete selected items"
                className="text-xs flex-1"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs"
              >
                {showAdvanced ? 'Less' : 'More'}
              </Button>
            </div>

            {/* Advanced actions */}
            {showAdvanced && (
              <>
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button size="sm" variant="outline" onClick={saveCanvas} className="text-xs flex-1">
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={exportCanvas} className="text-xs flex-1">
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
                
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={clearCanvas}
                  className="text-xs w-full"
                >
                  Clear All
                </Button>

                {/* Relationship Legend */}
                <div className="pt-2 border-t border-border">
                  <h4 className="text-xs font-semibold mb-2 text-foreground">Relationships:</h4>
                  <div className="space-y-1">
                    {Object.entries(RELATIONSHIP_TYPES).slice(1).map(([type, config]) => {
                      const textColor = isDark ? config.darkColor : config.color;
                      
                      return (
                        <div key={type} className="flex items-center justify-between text-xs">
                          <span style={{ color: textColor }}>{config.label}</span>
                          <div 
                            className="w-6 h-0.5 rounded"
                            style={{ backgroundColor: textColor }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
            
            {/* Quick Help */}
            <div className="text-xs text-muted-foreground pt-2 border-t border-border">
              <div className="flex justify-between mb-1">
                <span>{nodes.length} entities</span>
                <span>{edges.length} relationships</span>
              </div>
              <div className="text-[10px] space-y-0.5">
                <div>• Double-click to edit entities</div>
                <div>• Connect nodes for relationships</div>
                <div>• Select + Delete to remove</div>
              </div>
            </div>

            {/* ✅ Updated Relationship Type Selector with proper theme colors */}
            {pendingConnection && (
              <div className="pt-3 border-t border-border bg-card">
                <div className="space-y-3 p-3 bg-card border border-border rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm text-foreground">Select Relationship:</h3>
                  </div>
                  
                  {showCustomInput ? (
                    <div className="space-y-2">
                      <Input
                        placeholder="Enter custom relationship name..."
                        value={customLabel}
                        onChange={(e) => setCustomLabel(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleCustomRelationship();
                          } else if (e.key === 'Escape') {
                            cancelConnection();
                          }
                        }}
                        className="h-8 text-xs bg-background border-border"
                        style={{
                          color: isDark ? '#ffffff' : '#000000', // ✅ Force input text color
                        }}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={handleCustomRelationship}
                          disabled={!customLabel.trim()}
                          className="text-xs flex-1"
                        >
                          Create
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setShowCustomInput(false)}
                          className="text-xs flex-1"
                        >
                          Back
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {Object.entries(RELATIONSHIP_TYPES).map(([type, config]) => {
                        const textColor = isDark ? config.darkColor : config.color;
                        
                        return (
                          <button
                            key={type}
                            onClick={() => handleRelationshipSelect(type)}
                            className="block w-full text-left px-3 py-2 text-xs hover:bg-muted rounded transition-colors bg-card"
                          >
                            <div className="flex items-center justify-between">
                              <span style={{ color: textColor, fontWeight: '500' }}>
                                {type === 'custom' ? 'Custom...' : config.label}
                              </span>
                              <div 
                                className="w-8 h-1 rounded"
                                style={{ backgroundColor: textColor }}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  
                  {!showCustomInput && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={cancelConnection}
                      className="w-full text-xs"
                    >
                      Cancel Connection
                    </Button>
                  )}
                </div>
              </div>
            )}
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
      <div className="bg-background">
        <CanvasFlow />
      </div>
    </ReactFlowProvider>
  );
};