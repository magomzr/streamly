import type { IFlow, IExecutionResult } from '@streamly/shared';
export type { IFlow, IExecutionResult } from '@streamly/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface SavedFlow {
  id: string;
  name: string;
  data: IFlow;
  createdAt: string;
  updatedAt: string;
}

export const apiService = {
  async executeFlow(
    flow: IFlow,
    vars: Record<string, any> = {},
  ): Promise<IExecutionResult> {
    const response = await fetch(`${API_BASE_URL}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ flow, vars }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return response.ok;
    } catch {
      return false;
    }
  },

  async createFlow(flow: IFlow): Promise<SavedFlow> {
    const response = await fetch(`${API_BASE_URL}/flows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flow }),
    });
    if (!response.ok) throw new Error('Failed to create flow');
    return response.json();
  },

  async getFlows(): Promise<SavedFlow[]> {
    const response = await fetch(`${API_BASE_URL}/flows`);
    if (!response.ok) throw new Error('Failed to fetch flows');
    return response.json();
  },

  async getFlow(id: string): Promise<SavedFlow> {
    const response = await fetch(`${API_BASE_URL}/flows/${id}`);
    if (!response.ok) throw new Error('Failed to fetch flow');
    return response.json();
  },

  async updateFlow(id: string, flow: IFlow): Promise<SavedFlow> {
    const response = await fetch(`${API_BASE_URL}/flows/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flow }),
    });
    if (!response.ok) throw new Error('Failed to update flow');
    return response.json();
  },

  async deleteFlow(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/flows/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete flow');
  },

  async executeFlowById(
    id: string,
    vars: Record<string, any> = {},
  ): Promise<IExecutionResult> {
    const response = await fetch(`${API_BASE_URL}/flows/${id}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vars }),
    });
    if (!response.ok) throw new Error('Failed to execute flow');
    return response.json();
  },
};
