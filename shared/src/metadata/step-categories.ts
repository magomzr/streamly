import type { StepType } from '../types/flow.js';

export const STEP_CATEGORIES = {
  http: ['http_request', 'webhook'] as const,
  notifications: ['send_sms'] as const,
  dataManipulation: [
    'filter_array',
    'sort_array',
    'transform_data',
    'json_minifier',
  ] as const,
  encoding: ['base64_encode', 'base64_decode', 'string_format'] as const,
  utilities: ['delay'] as const,
} satisfies Record<string, readonly StepType[]>;
