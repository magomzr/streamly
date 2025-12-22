import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type OnConnect,
  type Node,
  type Edge,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { StepNode } from './nodes/StepNode.js';
import { NodeConfigPanel } from './NodeConfigPanel.js';
import { Sidebar } from './Sidebar.js';
import { ExecutionView } from './ExecutionView.js';
import { VarsEditor } from './VarsEditor.js';
import type { StepData, StepType } from '../types.js';
import { STEP_LABELS, type IFlow } from '@streamly/shared';
import { apiService } from '../services/api.js';
import { useExecutionStore } from '../stores/execution.js';
import { useFlowStore } from '../stores/flow.js';

const nodeTypes = {
  step: StepNode,
};

const initialNodes: Node<StepData>[] = [];
const initialEdges: any = [];

const getLayoutedElements = (nodes: Node<StepData>[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 150 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 180, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 90,
        y: nodeWithPosition.y - 40,
      },
    } as Node<StepData>;
  });

  return { nodes: layoutedNodes, edges };
};

function FlowBuilderInner() {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<StepData> | null>(null);
  const [flowName, setFlowName] = useState('Untitled Flow');
  const [vars, setVars] = useState<Record<string, any>>({});
  const [showExecution, setShowExecution] = useState(false);
  const [showVarsEditor, setShowVarsEditor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const { isExecuting, setExecuting, setResult, setError } =
    useExecutionStore();
  const {
    currentFlowId,
    flows,
    createFlow,
    updateFlow,
    setCurrentFlowId,
    setHasUnsavedChanges,
    hasUnsavedChanges,
  } = useFlowStore();

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange(changes);
      setHasUnsavedChanges(true);
    },
    [onEdgesChange, setHasUnsavedChanges],
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
      setHasUnsavedChanges(true);
    },
    [setEdges, setHasUnsavedChanges],
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<StepData>) => {
      setSelectedNode(node);
    },
    [],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleNodeUpdate = useCallback(
    (nodeId: string, data: Partial<StepData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node,
        ),
      );
      setSelectedNode((prev) =>
        prev?.id === nodeId
          ? { ...prev, data: { ...prev.data, ...data } }
          : prev,
      );
      setHasUnsavedChanges(true);
    },
    [setNodes, setHasUnsavedChanges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const stepType = event.dataTransfer.getData(
        'application/reactflow',
      ) as StepType;
      if (!stepType) return;

      const position = {
        x: event.clientX - 260,
        y: event.clientY,
      };

      const label = STEP_LABELS[stepType];
      let baseStepId = label.toLowerCase().replace(/\s+/g, '_');

      // Check for duplicates and add suffix
      const existingIds = nodes.map((n) => n.data.stepId);
      let stepId = baseStepId;
      let counter = 2;
      while (existingIds.includes(stepId)) {
        stepId = `${baseStepId}_${counter}`;
        counter++;
      }

      const newNode: Node<StepData> = {
        id: `${Date.now()}`,
        type: 'step',
        position,
        data: {
          label,
          stepId,
          stepType,
          settings: {},
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setHasUnsavedChanges(true);
    },
    [nodes, setNodes, setHasUnsavedChanges],
  );

  const buildFlow = useCallback((): IFlow => {
    return {
      name: flowName,
      steps: nodes.map((node) => ({
        id: node.id,
        name: node.data.stepId,
        type: node.data.stepType,
        settings: node.data.settings || {},
      })),
      edges: edges.map((edge) => ({
        source: edge.source,
        target: edge.target,
      })),
    };
  }, [flowName, nodes, edges]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const flow = buildFlow();
      if (currentFlowId) {
        await updateFlow(currentFlowId, flow);
      } else {
        const saved = await createFlow(flow);
        setCurrentFlowId(saved.id);
      }
    } catch (err) {
      alert('Failed to save flow');
    } finally {
      setIsSaving(false);
    }
  }, [currentFlowId, buildFlow, createFlow, updateFlow, setCurrentFlowId]);

  const handleLoadFlow = useCallback(
    async (flowId: string) => {
      const flow = flows.find((f) => f.id === flowId);
      if (!flow) return;

      setFlowName(flow.data.name);
      setNodes(
        flow.data.steps.map((step, idx) => ({
          id: step.id,
          type: 'step' as const,
          position: { x: 100 + idx * 200, y: 100 },
          data: {
            label: step.name || 'Unnamed',
            stepId: step.name || 'unnamed',
            stepType: step.type,
            settings: step.settings || {},
          },
        })),
      );
      setEdges(
        (flow.data.edges || []).map((edge, idx) => ({
          id: `e${idx}`,
          source: edge.source,
          target: edge.target,
        })),
      );
      setCurrentFlowId(flowId);
      setHasUnsavedChanges(false);
    },
    [flows, setNodes, setEdges, setCurrentFlowId, setHasUnsavedChanges],
  );

  const handleNewFlow = useCallback(() => {
    setFlowName('Untitled Flow');
    setNodes([]);
    setEdges([]);
    setVars({});
    setCurrentFlowId(null);
    setHasUnsavedChanges(false);
  }, [setNodes, setEdges, setCurrentFlowId, setHasUnsavedChanges]);

  const handleAutoLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setTimeout(() => fitView({ duration: 200 }), 0);
    setHasUnsavedChanges(true);
  }, [nodes, edges, setNodes, setEdges, fitView, setHasUnsavedChanges]);

  const handleExecute = useCallback(async () => {
    setExecuting(true);
    setError(null);
    setShowExecution(true);

    try {
      let flowId = currentFlowId;
      
      // Auto-save if needed
      if (!flowId || hasUnsavedChanges) {
        const flow = buildFlow();
        if (flowId) {
          await updateFlow(flowId, flow);
        } else {
          const saved = await createFlow(flow);
          flowId = saved.id;
          setCurrentFlowId(flowId);
        }
      }

      const result = await apiService.executeFlowById(flowId, vars);
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setExecuting(false);
    }
  }, [currentFlowId, hasUnsavedChanges, buildFlow, createFlow, updateFlow, setCurrentFlowId, vars, setExecuting, setResult, setError]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Sidebar onLoadFlow={handleLoadFlow} onNewFlow={handleNewFlow} />

      <div
        style={{
          marginLeft: '260px',
          height: '100%',
          marginBottom: showExecution ? '300px' : '0',
          transition: 'margin-bottom 0.3s',
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      <NodeConfigPanel
        selectedNode={selectedNode}
        onClose={() => setSelectedNode(null)}
        onUpdate={handleNodeUpdate}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontSize: '14px',
            color: '#6b7280',
            marginRight: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {isEditingName ? (
            <input
              type="text"
              value={flowName}
              onChange={(e) => {
                const value = e.target.value.slice(0, 50);
                setFlowName(value);
                setHasUnsavedChanges(true);
              }}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEditingName(false);
                if (e.key === 'Escape') {
                  setIsEditingName(false);
                }
              }}
              autoFocus
              style={{
                padding: '4px 8px',
                border: '1px solid #3b82f6',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
                minWidth: '150px',
              }}
            />
          ) : (
            <span
              onClick={() => setIsEditingName(true)}
              style={{
                cursor: 'pointer',
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'inline-block',
              }}
              title={flowName}
            >
              {flowName}
            </span>
          )}
          {hasUnsavedChanges && <span style={{ color: '#f59e0b' }}>•</span>}
        </div>

        <button
          onClick={handleAutoLayout}
          style={{
            padding: '8px 16px',
            backgroundColor: 'white',
            color: '#6b7280',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Auto Layout
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            padding: '8px 16px',
            backgroundColor: isSaving ? '#9ca3af' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: isSaving ? 'not-allowed' : 'pointer',
          }}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>

        <button
          onClick={handleExecute}
          disabled={isExecuting}
          style={{
            padding: '10px 24px',
            backgroundColor: isExecuting ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: isExecuting ? 'not-allowed' : 'pointer',
          }}
        >
          {isExecuting ? 'Executing...' : '▶ Run Flow'}
        </button>

        <button
          onClick={() => setShowVarsEditor(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: 'white',
            color: '#6b7280',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Variables{' '}
          {Object.keys(vars).length > 0 && `(${Object.keys(vars).length})`}
        </button>
      </div>

      {showVarsEditor && (
        <VarsEditor
          vars={vars}
          onChange={(newVars: Record<string, any>) => {
            setVars(newVars);
            setShowVarsEditor(false);
          }}
          onClose={() => setShowVarsEditor(false)}
        />
      )}

      {showExecution && (
        <ExecutionView onClose={() => setShowExecution(false)} />
      )}
    </div>
  );
}

export function FlowBuilder() {
  return (
    <ReactFlowProvider>
      <FlowBuilderInner />
    </ReactFlowProvider>
  );
}
