export interface IContext {
  id: string;
  name: string;
  vars: Record<string, any>;
  steps: Record<string, any>;
  logs: string[];
  status: 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  error?: {
    stepId: string;
    stepName?: string;
    message: string;
    attempt: number;
  };
}

export interface IExecutionResult {
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
