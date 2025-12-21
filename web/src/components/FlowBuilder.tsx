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
import type { StepData } from '../types/steps.js';

const nodeTypes = {
  step: StepNode,
};

const initialNodes: Node<StepData>[] = [
  {
    id: '1',
    type: 'step',
    data: {
      label: 'Fetch Todos',
      stepType: 'http_request',
      settings: { url: 'https://api.example.com/todos' },
    },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    type: 'step',
    data: {
      label: 'Filter Completed',
      stepType: 'filter_array',
      settings: { field: 'completed', operator: '===', value: true },
    },
    position: { x: 250, y: 120 },
  },
  {
    id: '3',
    type: 'step',
    data: {
      label: 'Send Notification',
      stepType: 'send_sms',
      settings: { message: 'Flow completed!' },
    },
    position: { x: 250, y: 240 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

export function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<StepData> | null>(null);

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

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
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

      <NodeConfigPanel
        selectedNode={selectedNode}
        onClose={() => setSelectedNode(null)}
        onUpdate={handleNodeUpdate}
      />
    </div>
  );
}
