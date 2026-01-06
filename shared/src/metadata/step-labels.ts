import type { StepType } from '../types/flow.js';

export const STEP_LABELS: Record<StepType, string> = {
  conditional: 'Conditional',
  html_parser: 'HTML parser',
  extract_links: 'Extract links',
  extract_text: 'Extract text',
  http_request: 'HTTP request',
  log_message: 'Log message',
  send_email: 'Send email',
  json_minifier: 'Minify JSON',
  delay: 'Delay',
  transform_data: 'Transform data',
  filter_array: 'Filter array',
  sort_array: 'Sort array',
  string_format: 'Format string',
  base64_encode: 'Base64 encode',
  base64_decode: 'Base64 decode',
};
