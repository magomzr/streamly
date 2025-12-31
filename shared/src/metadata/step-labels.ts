import type { StepType } from '../types/flow.js';

export const STEP_LABELS: Record<StepType, string> = {
  conditional: 'Conditional',
  html_parser: 'HTML Parser',
  extract_links: 'Extract Links',
  extract_text: 'Extract Text',
  http_request: 'HTTP Request',
  log_message: 'Log Message',
  send_email: 'Send Email',
  json_minifier: 'Minify JSON',
  delay: 'Delay',
  transform_data: 'Transform Data',
  filter_array: 'Filter Array',
  sort_array: 'Sort Array',
  string_format: 'Format String',
  base64_encode: 'Base64 Encode',
  base64_decode: 'Base64 Decode',
};
