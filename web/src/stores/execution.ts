import { create } from 'zustand';
import type { IExecutionResult } from '@streamly/shared';

type StepStatus = 'pending' | 'running' | 'completed' | 'error';

interface StepProgress {
  stepId: string;
  status: StepStatus;
  timestamp?: Date;
}

interface ExecutionState {
  isExecuting: boolean;
  result: IExecutionResult | null;
  error: string | null;
  stepProgress: Record<string, StepProgress>;
  setExecuting: (executing: boolean) => void;
  setResult: (result: IExecutionResult | null) => void;
  setError: (error: string | null) => void;
  setStepProgress: (stepId: string, status: StepStatus) => void;
  clearProgress: () => void;
  reset: () => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  isExecuting: false,
  result: null,
  error: null,
  stepProgress: {},
  setExecuting: (executing) => set({ isExecuting: executing }),
  setResult: (result) => set({ result, error: null }),
  setError: (error) => set({ error, isExecuting: false }),
  setStepProgress: (stepId, status) =>
    set((state) => ({
      stepProgress: {
        ...state.stepProgress,
        [stepId]: { stepId, status, timestamp: new Date() },
      },
    })),
  clearProgress: () => set({ stepProgress: {} }),
  reset: () =>
    set({ isExecuting: false, result: null, error: null, stepProgress: {} }),
}));
