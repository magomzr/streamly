import { create } from 'zustand';
import type { IFlow } from '@streamly/shared';
import { apiService, type SavedFlow } from '../services/api';

interface FlowStore {
  flows: SavedFlow[];
  currentFlowId: string | null;
  hasUnsavedChanges: boolean;
  isLoading: boolean;

  loadFlows: () => Promise<void>;
  createFlow: (flow: IFlow) => Promise<SavedFlow>;
  updateFlow: (id: string, flow: IFlow) => Promise<void>;
  deleteFlow: (id: string) => Promise<void>;
  setCurrentFlowId: (id: string | null) => void;
  setHasUnsavedChanges: (value: boolean) => void;
}

export const useFlowStore = create<FlowStore>((set) => ({
  flows: [],
  currentFlowId: null,
  hasUnsavedChanges: false,
  isLoading: false,

  loadFlows: async () => {
    set({ isLoading: true });
    try {
      const flows = await apiService.getFlows();
      set({ flows, isLoading: false });
    } catch (error) {
      console.error('Failed to load flows:', error);
      set({ isLoading: false });
    }
  },

  createFlow: async (flow: IFlow) => {
    const savedFlow = await apiService.createFlow(flow);
    set((state) => ({
      flows: [...state.flows, savedFlow],
      currentFlowId: savedFlow.id,
      hasUnsavedChanges: false,
    }));
    return savedFlow;
  },

  updateFlow: async (id: string, flow: IFlow) => {
    const updated = await apiService.updateFlow(id, flow);
    set((state) => ({
      flows: state.flows.map((f) => (f.id === id ? updated : f)),
      hasUnsavedChanges: false,
    }));
  },

  deleteFlow: async (id: string) => {
    await apiService.deleteFlow(id);
    set((state) => ({
      flows: state.flows.filter((f) => f.id !== id),
      currentFlowId: state.currentFlowId === id ? null : state.currentFlowId,
    }));
  },

  setCurrentFlowId: (id: string | null) => {
    set({ currentFlowId: id });
  },

  setHasUnsavedChanges: (value: boolean) => {
    set({ hasUnsavedChanges: value });
  },
}));
