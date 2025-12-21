const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export type { IFlow, IExecutionResult } from '@streamly/shared';

export const apiService = {
  async executeFlow(
    flow: import('@streamly/shared').IFlow,
    vars: Record<string, any> = {},
  ): Promise<import('@streamly/shared').IExecutionResult> {
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
