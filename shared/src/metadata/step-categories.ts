import type { StepType } from '../types/flow.js';

export const STEP_CATEGORIES = {
  controlFlow: ['conditional'] as const,
  http: ['http_request'] as const,
  webScraping: ['html_parser', 'extract_links', 'extract_text'] as const,
  notifications: ['send_email'] as const,
  dataManipulation: [
    'filter_array',
    'sort_array',
    'transform_data',
    'json_minifier',
  ] as const,
  encoding: ['base64_encode', 'base64_decode', 'string_format'] as const,
  utilities: ['delay', 'log_message'] as const,
} satisfies Record<string, readonly StepType[]>;
