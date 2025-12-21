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

export interface StepData extends Record<string, unknown> {
  label: string;
  stepType: StepType;
  settings?: Record<string, any>;
}

export const STEP_CATEGORIES = {
  http: ['http_request', 'webhook'],
  notifications: ['send_sms'],
  dataManipulation: [
    'filter_array',
    'sort_array',
    'transform_data',
    'json_minifier',
  ],
  encoding: ['base64_encode', 'base64_decode', 'string_format'],
  utilities: ['delay'],
} as const;

export const STEP_LABELS: Record<StepType, string> = {
  http_request: 'HTTP Request',
  send_sms: 'Send SMS',
  json_minifier: 'Minify JSON',
  delay: 'Delay',
  transform_data: 'Transform Data',
  webhook: 'Webhook',
  filter_array: 'Filter Array',
  sort_array: 'Sort Array',
  string_format: 'Format String',
  base64_encode: 'Base64 Encode',
  base64_decode: 'Base64 Decode',
};
