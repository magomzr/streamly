import type { StepType } from '@streamly/shared';

// StepData extends shared types with UI-specific properties
export interface StepData extends Record<string, unknown> {
  label: string;
  stepType: StepType;
  settings?: Record<string, any>;
}

// Re-export shared types for convenience
export type { StepType } from '@streamly/shared';
