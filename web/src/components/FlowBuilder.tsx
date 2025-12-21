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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { StepNode } from './nodes/StepNode.js';
import { NodeConfigPanel } from './NodeConfigPanel.js';
import { Sidebar } from './Sidebar.js';
import { BottomToolbar } from './BottomToolbar.js';
import { ExecutionView } from './ExecutionView.js';
import type { StepData, StepType } from '../types/steps.js';
import { STEP_LABELS } from '../types/steps.js';
import { apiService, type FlowDefinition } from '../services/api.js';
import { useExecutionStore } from '../stores/execution.js';

const nodeTypes = {
  step: StepNode,
};

const initialNodes: Node<StepData>[] = [];
const initialEdges: any = [];

export function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<StepData> | null>(null);
  const [vars, setVars] = useState<Record<string, any>>({
    phoneNumber: '+57 300 123 4567',
  });
  const [showExecution, setShowExecution] = useState(false);
  const { setExecuting, setResult, setError } = useExecutionStore();

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
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
    },
    [setNodes],
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

      const newNode: Node<StepData> = {
        id: `${Date.now()}`,
        type: 'step',
        position,
        data: {
          label: STEP_LABELS[stepType],
          stepType,
          settings: {},
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes],
  );

  const handleExecute = useCallback(async () => {
    setExecuting(true);
    setError(null);
    setShowExecution(true);

    try {
      const flow: FlowDefinition = {
        name: 'Flow from UI',
        steps: nodes.map((node) => ({
          id: node.id,
          name: node.data.label,
          type: node.data.stepType,
          settings: node.data.settings || {},
        })),
      };

      const result = await apiService.executeFlow(flow, vars);
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setExecuting(false);
    }
  }, [nodes, vars, setExecuting, setResult, setError]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Sidebar />

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
          onEdgesChange={onEdgesChange}
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

      <BottomToolbar
        onExecute={handleExecute}
        vars={vars}
        onVarsChange={setVars}
      />

      {showExecution && (
        <ExecutionView onClose={() => setShowExecution(false)} />
      )}
    </div>
  );
}
