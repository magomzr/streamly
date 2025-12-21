import type { StepType } from './steps.js';

export interface FieldSchema {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'boolean';
  placeholder?: string;
  required?: boolean;
  options?: { value: string | number | boolean; label: string }[];
  defaultValue?: any;
}

export const STEP_SCHEMAS: Record<StepType, FieldSchema[]> = {
  http_request: [
    {
      name: 'url',
      label: 'URL',
      type: 'text',
      placeholder: 'https://api.example.com/data',
      required: true,
    },
    {
      name: 'method',
      label: 'Method',
      type: 'select',
      options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
      ],
      defaultValue: 'GET',
    },
  ],

  webhook: [
    {
      name: 'url',
      label: 'Webhook URL',
      type: 'text',
      placeholder: 'https://webhook.site/...',
      required: true,
    },
    {
      name: 'payload',
      label: 'Payload (JSON)',
      type: 'textarea',
      placeholder: '{"key": "value"}',
    },
  ],

  send_sms: [
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Your message here...',
      required: true,
    },
  ],

  filter_array: [
    {
      name: 'array',
      label: 'Array',
      type: 'text',
      placeholder: '{{steps.fetchData}}',
      required: true,
    },
    {
      name: 'field',
      label: 'Field',
      type: 'text',
      placeholder: 'completed',
      required: true,
    },
    {
      name: 'operator',
      label: 'Operator',
      type: 'select',
      options: [
        { value: '===', label: 'Equals (===)' },
        { value: '!==', label: 'Not Equals (!==)' },
        { value: '>', label: 'Greater Than (>)' },
        { value: '<', label: 'Less Than (<)' },
        { value: '>=', label: 'Greater or Equal (>=)' },
        { value: '<=', label: 'Less or Equal (<=)' },
      ],
      defaultValue: '===',
    },
    { name: 'value', label: 'Value', type: 'text', required: true },
  ],

  sort_array: [
    {
      name: 'array',
      label: 'Array',
      type: 'text',
      placeholder: '{{steps.fetchData}}',
      required: true,
    },
    {
      name: 'field',
      label: 'Field',
      type: 'text',
      placeholder: 'userId',
      required: true,
    },
    {
      name: 'order',
      label: 'Order',
      type: 'select',
      options: [
        { value: 'asc', label: 'Ascending' },
        { value: 'desc', label: 'Descending' },
      ],
      defaultValue: 'asc',
    },
  ],

  transform_data: [
    {
      name: 'mapping',
      label: 'Mapping (JSON)',
      type: 'textarea',
      placeholder: '{"userId": "{{steps.fetchUser.id}}"}',
      required: true,
    },
  ],

  json_minifier: [
    {
      name: 'jsonString',
      label: 'JSON String',
      type: 'text',
      placeholder: '{{steps.fetchData}}',
      required: true,
    },
  ],

  delay: [
    {
      name: 'milliseconds',
      label: 'Delay (ms)',
      type: 'number',
      placeholder: '1000',
      defaultValue: 1000,
      required: true,
    },
  ],

  string_format: [
    {
      name: 'text',
      label: 'Text',
      type: 'text',
      placeholder: '{{steps.fetchUser.name}}',
      required: true,
    },
    {
      name: 'operation',
      label: 'Operation',
      type: 'select',
      options: [
        { value: 'uppercase', label: 'Uppercase' },
        { value: 'lowercase', label: 'Lowercase' },
        { value: 'capitalize', label: 'Capitalize' },
        { value: 'trim', label: 'Trim' },
      ],
      defaultValue: 'trim',
    },
  ],

  base64_encode: [
    {
      name: 'text',
      label: 'Text to Encode',
      type: 'text',
      placeholder: 'Hello World',
      required: true,
    },
  ],

  base64_decode: [
    {
      name: 'encoded',
      label: 'Encoded Text',
      type: 'text',
      placeholder: 'SGVsbG8gV29ybGQ=',
      required: true,
    },
  ],
};
