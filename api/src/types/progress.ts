export type ProgressEventType =
  | 'step_start'
  | 'step_complete'
  | 'step_error'
  | 'flow_complete'
  | 'flow_error';

export interface IProgressEvent {
  type: ProgressEventType;
  stepId?: string;
  stepName?: string;
  stepType?: string;
  timestamp: Date;
  message?: string;
  data?: any;
}
