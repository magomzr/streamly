export type StepType =
  | 'conditional'
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
  | 'base64_decode'
  | 'html_parser'
  | 'extract_links'
  | 'extract_text';

export interface IStepDefinition {
  id: string;
  name?: string;
  label?: string;
  type: StepType;
  settings?: Record<string, any>;
  retry?: {
    maxAttempts?: number;
  };
}

export interface IEdge {
  source: string;
  target: string;
  branch?: 'true' | 'false';
}

export interface IFlow {
  name: string;
  steps: IStepDefinition[];
  edges?: IEdge[];
}
