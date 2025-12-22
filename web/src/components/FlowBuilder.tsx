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
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { StepNode } from './nodes/StepNode.js';
import { NodeConfigPanel } from './NodeConfigPanel.js';
import { Sidebar } from './Sidebar.js';
import { ExecutionView } from './ExecutionView.js';
import { VarsEditor } from './VarsEditor.js';
import type { StepData, StepType } from '../types.js';
import { STEP_LABELS, STEP_SCHEMAS, type IFlow } from '@streamly/shared';
import { apiService } from '../services/api.js';
import { useExecutionStore } from '../stores/execution.js';
import { useFlowStore } from '../stores/flow.js';
import { generateUUID } from '../utils.js';

const nodeTypes = {
  step: StepNode,
};

const initialNodes: Node<StepData>[] = [];
const initialEdges: any = [];

const getLayoutedElements = (nodes: Node<StepData>[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'LR', nodesep: 100, ranksep: 150 });

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
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);
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

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId),
      );
      if (selectedNode?.id === nodeId) setSelectedNode(null);
      setHasUnsavedChanges(true);
    },
    [setNodes, setEdges, selectedNode, setHasUnsavedChanges],
  );

  useCallback(() => {
    const handleDeleteEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ nodeId: string }>;
      handleDeleteNode(customEvent.detail.nodeId);
    };
    window.addEventListener('deleteNode', handleDeleteEvent);
    return () => window.removeEventListener('deleteNode', handleDeleteEvent);
  }, [handleDeleteNode])();

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange(changes);
      setHasUnsavedChanges(true);
    },
    [onEdgesChange, setHasUnsavedChanges],
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          { ...params, markerEnd: { type: MarkerType.ArrowClosed } },
          eds,
        ),
      );
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
        id: generateUUID(),
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
    const orderedSteps = topologicalSort(nodes, edges);

    return {
      name: flowName,
      steps: orderedSteps.map((node) => ({
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

  const topologicalSort = (
    nodes: Node<StepData>[],
    edges: Edge[],
  ): Node<StepData>[] => {
    if (edges.length === 0) return nodes;

    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    nodes.forEach((node) => {
      graph.set(node.id, []);
      inDegree.set(node.id, 0);
    });

    edges.forEach((edge) => {
      graph.get(edge.source)?.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });

    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) queue.push(nodeId);
    });

    const sorted: string[] = [];
    while (queue.length > 0) {
      const current = queue.shift()!;
      sorted.push(current);

      graph.get(current)?.forEach((neighbor) => {
        const newDegree = inDegree.get(neighbor)! - 1;
        inDegree.set(neighbor, newDegree);
        if (newDegree === 0) queue.push(neighbor);
      });
    }

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    return sorted.map((id) => nodeMap.get(id)!).filter(Boolean);
  };

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
          markerEnd: { type: MarkerType.ArrowClosed },
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
  }, [
    currentFlowId,
    hasUnsavedChanges,
    buildFlow,
    createFlow,
    updateFlow,
    setCurrentFlowId,
    vars,
    setExecuting,
    setResult,
    setError,
  ]);

  const handleExportJSON = useCallback(() => {
    const flow = buildFlow();
    const dataStr = JSON.stringify(flow, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${flowName.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [buildFlow, flowName]);

  const handleImportJSON = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const imported: IFlow = JSON.parse(text);

        setFlowName(imported.name);
        setNodes(
          imported.steps.map((step, idx) => ({
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
          (imported.edges || []).map((edge, idx) => ({
            id: `e${idx}`,
            source: edge.source,
            target: edge.target,
            markerEnd: { type: MarkerType.ArrowClosed },
          })),
        );
        setCurrentFlowId(null);
        setHasUnsavedChanges(true);
      } catch (err) {
        alert('Failed to import flow: Invalid JSON');
      }
    };
    input.click();
  }, [setNodes, setEdges, setCurrentFlowId, setHasUnsavedChanges]);

  const validateFlow = useCallback(() => {
    const errors: string[] = [];

    // Check if flow is empty
    if (nodes.length === 0) {
      errors.push('Flow is empty. Add at least one step.');
      return errors;
    }

    // Check for disconnected nodes (if there are edges)
    if (edges.length > 0) {
      const connectedNodes = new Set<string>();
      edges.forEach((edge) => {
        connectedNodes.add(edge.source);
        connectedNodes.add(edge.target);
      });
      nodes.forEach((node) => {
        if (!connectedNodes.has(node.id)) {
          errors.push(`Step "${node.data.label}" is not connected`);
        }
      });
    }

    // Check for cycles
    const hasCycle = () => {
      const visited = new Set<string>();
      const recStack = new Set<string>();
      const graph = new Map<string, string[]>();

      nodes.forEach((node) => graph.set(node.id, []));
      edges.forEach((edge) => {
        graph.get(edge.source)?.push(edge.target);
      });

      const dfs = (nodeId: string): boolean => {
        visited.add(nodeId);
        recStack.add(nodeId);

        for (const neighbor of graph.get(nodeId) || []) {
          if (!visited.has(neighbor)) {
            if (dfs(neighbor)) return true;
          } else if (recStack.has(neighbor)) {
            return true;
          }
        }

        recStack.delete(nodeId);
        return false;
      };

      for (const nodeId of graph.keys()) {
        if (!visited.has(nodeId)) {
          if (dfs(nodeId)) return true;
        }
      }
      return false;
    };

    if (hasCycle()) {
      errors.push('Flow contains a cycle (infinite loop detected)');
    }

    // Check for required fields
    nodes.forEach((node) => {
      const schema = STEP_SCHEMAS[node.data.stepType];
      if (!schema) return;

      schema.forEach((field) => {
        if (field.required) {
          const value = node.data.settings?.[field.name];
          if (value === undefined || value === null || value === '') {
            errors.push(
              `Step "${node.data.label}": Required field "${field.label}" is empty`,
            );
          }
        }
      });
    });

    return errors;
  }, [nodes, edges]);

  const handleValidate = useCallback(() => {
    const errors = validateFlow();
    setValidationErrors(errors);
    setShowValidation(true);
  }, [validateFlow]);

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

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
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
            Options ▾
          </button>

          {showOptionsMenu && (
            <>
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 999,
                }}
                onClick={() => setShowOptionsMenu(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: 0,
                  marginBottom: '8px',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  minWidth: '160px',
                  zIndex: 1000,
                }}
              >
                <button
                  onClick={() => {
                    handleAutoLayout();
                    setShowOptionsMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    cursor: 'pointer',
                    color: '#374151',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#f3f4f6')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  Auto Layout
                </button>
                <button
                  onClick={() => {
                    handleValidate();
                    setShowOptionsMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    cursor: 'pointer',
                    color: '#374151',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#f3f4f6')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  ✓ Validate Flow
                </button>
                <button
                  onClick={() => {
                    handleExportJSON();
                    setShowOptionsMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    cursor: 'pointer',
                    color: '#374151',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#f3f4f6')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  ↓ Export JSON
                </button>
                <button
                  onClick={() => {
                    handleImportJSON();
                    setShowOptionsMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    cursor: 'pointer',
                    color: '#374151',
                    borderRadius: '0 0 6px 6px',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#f3f4f6')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  ↑ Import JSON
                </button>
              </div>
            </>
          )}
        </div>

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

      {showValidation && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowValidation(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                Flow Validation
              </h3>
              <button
                onClick={() => setShowValidation(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {validationErrors.length === 0 ? (
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#d1fae5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '6px',
                  color: '#065f46',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '20px' }}>✓</span>
                <span style={{ fontWeight: 500 }}>Flow is valid!</span>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      color: '#991b1b',
                      marginBottom: '8px',
                    }}
                  >
                    Found {validationErrors.length} issue
                    {validationErrors.length > 1 ? 's' : ''}:
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '20px',
                      color: '#991b1b',
                    }}
                  >
                    {validationErrors.map((error, i) => (
                      <li key={i} style={{ marginBottom: '4px' }}>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowValidation(false)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                marginTop: '16px',
              }}
            >
              Close
            </button>
          </div>
        </div>
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
