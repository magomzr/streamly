import type { Node, Edge } from '@xyflow/react';
import type { StepData } from '../types';
import { STEP_SCHEMAS } from '@streamly/shared';

export const validateFlow = (
  nodes: Node<StepData>[],
  edges: Edge[],
): string[] => {
  const errors: string[] = [];

  if (nodes.length === 0) {
    errors.push('Flow is empty. Add at least one step.');
    return errors;
  }

  // Check for disconnected nodes
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
};
