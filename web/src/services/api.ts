const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface FlowDefinition {
  name: string;
  steps: Array<{
    id: string;
    name?: string;
    type: string;
    settings?: Record<string, any>;
    retry?: {
      maxAttempts?: number;
    };
  }>;
}

export interface FlowExecutionResult {
  id: string;
  name: string;
  vars: Record<string, any>;
  steps: Record<string, any>;
  logs: string[];
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  error?: {
    stepId: string;
    stepName?: string;
    message: string;
    attempt: number;
  };
}

export const apiService = {
  async executeFlow(
    flow: FlowDefinition,
    vars: Record<string, any> = {},
  ): Promise<FlowExecutionResult> {
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
};
