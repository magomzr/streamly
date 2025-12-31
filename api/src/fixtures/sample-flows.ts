import { generateUUID } from '../utils';
import type { IFlow } from '@streamly/shared';

export const vars = {
  phoneNumber: '+57 300 123 4567',
};

export const sampleFlow: IFlow = {
  name: 'Simple Flow',
  steps: [
    {
      id: generateUUID(),
      type: 'http_request',
      name: 'fetchTodo',
      settings: { url: 'https://jsonplaceholder.typicode.com/todos/1' },
      retry: {
        maxAttempts: 3,
      },
    },
    {
      id: generateUUID(),
      type: 'log_message',
      name: 'logMessageStep',
      settings: {
        message: 'Fetched title: {{steps.fetchTodo.title}}',
      },
      retry: {
        maxAttempts: 2,
      },
    },
  ],
};

export const failingFlow: IFlow = {
  name: 'Failing Flow',
  steps: [
    {
      id: generateUUID(),
      type: 'http_request',
      name: 'fetchInvalidUrl',
      settings: { url: 'https://this-url-does-not-exist-12345.com/api' },
      retry: {
        maxAttempts: 3,
      },
    },
    {
      id: generateUUID(),
      type: 'json_minifier',
      name: 'minifyJson',
      settings: {
        jsonString: '{{steps.fetchInvalidUrl}}',
      },
    },
    {
      id: generateUUID(),
      type: 'log_message',
      name: 'neverLogMessageStep',
      settings: {
        message: 'This should never execute',
      },
    },
  ],
};

export const complexFlow: IFlow = {
  name: 'Complex Flow - All Steps',
  steps: [
    {
      id: generateUUID(),
      type: 'http_request',
      name: 'fetchTodos',
      settings: { url: 'https://jsonplaceholder.typicode.com/todos' },
    },
    {
      id: generateUUID(),
      type: 'filter_array',
      name: 'filterCompleted',
      settings: {
        array: '{{steps.fetchTodos}}',
        field: 'completed',
        operator: '===',
        value: true,
      },
    },
    {
      id: generateUUID(),
      type: 'sort_array',
      name: 'sortByUserId',
      settings: {
        array: '{{steps.filterCompleted.filtered}}',
        field: 'userId',
        order: 'asc',
      },
    },
    {
      id: generateUUID(),
      type: 'json_minifier',
      name: 'minifyTodos',
      settings: {
        jsonString: '{{steps.sortByUserId.sorted}}',
      },
    },
    {
      id: generateUUID(),
      type: 'delay',
      name: 'waitBeforeUser',
      settings: { milliseconds: 1000 },
    },
    {
      id: generateUUID(),
      type: 'http_request',
      name: 'fetchUser',
      settings: { url: 'https://jsonplaceholder.typicode.com/users/1' },
    },
    {
      id: generateUUID(),
      type: 'string_format',
      name: 'formatUserName',
      settings: {
        text: '{{steps.fetchUser.name}}',
        operation: 'uppercase',
      },
    },
    {
      id: generateUUID(),
      type: 'transform_data',
      name: 'transformUser',
      settings: {
        mapping: {
          userId: '{{steps.fetchUser.id}}',
          fullName: '{{steps.formatUserName.formatted}}',
          email: '{{steps.fetchUser.email}}',
        },
      },
    },
    {
      id: generateUUID(),
      type: 'base64_encode',
      name: 'encodeEmail',
      settings: {
        text: '{{steps.transformUser.email}}',
      },
    },
    {
      id: generateUUID(),
      type: 'base64_decode',
      name: 'decodeEmail',
      settings: {
        encoded: '{{steps.encodeEmail.encoded}}',
      },
    },
    {
      id: generateUUID(),
      type: 'log_message',
      name: 'logSummary',
      settings: {
        message:
          'Completed: {{steps.filterCompleted.count}}, User: {{steps.transformUser.fullName}}',
      },
    },
  ],
};
