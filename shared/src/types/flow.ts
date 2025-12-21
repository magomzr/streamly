export type StepType =
  | 'http_request'
  | 'send_sms'
  | 'json_minifier'
  | 'delay'
  | 'transform_data'
  | 'webhook'
  | 'filter_array'
  | 'sort_array'
  | 'string_format'
  | 'base64_encode'
  | 'base64_decode';

export interface IStepDefinition {
  id: string;
  name?: string;
  type: StepType;
  settings?: Record<string, any>;
  retry?: {
    maxAttempts?: number;
  };
}

export interface IFlow {
  name: string;
  steps: IStepDefinition[];
}
