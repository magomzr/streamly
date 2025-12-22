import { create } from 'zustand';
import type { IExecutionResult } from '@streamly/shared';

interface ExecutionState {
  isExecuting: boolean;
  result: IExecutionResult | null;
  error: string | null;
  setExecuting: (executing: boolean) => void;
  setResult: (result: IExecutionResult | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  isExecuting: false,
  result: null,
  error: null,
  setExecuting: (executing) => set({ isExecuting: executing }),
  setResult: (result) => set({ result, error: null }),
  setError: (error) => set({ error, isExecuting: false }),
  reset: () => set({ isExecuting: false, result: null, error: null }),
}));
