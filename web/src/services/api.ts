import type { IFlow, IExecutionResult } from '@streamly/shared';
export type { IFlow, IExecutionResult } from '@streamly/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface SavedFlow {
  id: string;
  name: string;
  data: IFlow;
  triggerType: string;
  cronExpression: string | null;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type { SavedFlow };

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

  async updateTrigger(
    id: string,
    type: string,
    cronExpression?: string,
    enabled?: boolean,
  ): Promise<SavedFlow> {
    const response = await fetch(`${API_BASE_URL}/flows/${id}/trigger`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, cronExpression, enabled }),
    });
    if (!response.ok) throw new Error('Failed to update trigger');
    return response.json();
  },

  async enableFlow(id: string): Promise<SavedFlow> {
    const response = await fetch(`${API_BASE_URL}/flows/${id}/enable`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to enable flow');
    return response.json();
  },

  async disableFlow(id: string): Promise<SavedFlow> {
    const response = await fetch(`${API_BASE_URL}/flows/${id}/disable`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to disable flow');
    return response.json();
  },

  async getScheduledFlows(): Promise<SavedFlow[]> {
    const response = await fetch(`${API_BASE_URL}/flows/scheduled/list`);
    if (!response.ok) throw new Error('Failed to fetch scheduled flows');
    return response.json();
  },

  async getActiveScheduledFlows(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/flows/scheduled/active`);
    if (!response.ok) throw new Error('Failed to fetch active scheduled flows');
    return response.json();
  },

  async getActiveFlowsCount(): Promise<{ active: number }> {
    const response = await fetch(`${API_BASE_URL}/flows/scheduled/count`);
    if (!response.ok) throw new Error('Failed to fetch active flows count');
    return response.json();
  },

  async getExecutions(flowId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/flows/${flowId}/executions`);
    if (!response.ok) throw new Error('Failed to fetch executions');
    return response.json();
  },
};
