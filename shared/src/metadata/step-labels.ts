import type { StepType } from '../types/flow.js';

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
