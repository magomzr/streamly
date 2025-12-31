import type { IFlow } from '@streamly/shared';

export const vars = {
  phoneNumber: '+57 300 123 4567',
};

export const sampleFlow: IFlow = {
  name: 'Simple Flow',
  steps: [
    {
      id: 'step-1',
      type: 'http_request',
      name: 'fetchTodo',
      settings: { url: 'https://jsonplaceholder.typicode.com/todos/1' },
      retry: {
        maxAttempts: 3,
      },
    },
    {
      id: 'step-2',
      type: 'log_message',
      name: 'logMessageStep',
      settings: {
        message: 'Fetched title: {{steps.fetchTodo.data.title}}',
      },
      retry: {
        maxAttempts: 2,
      },
    },
  ],
  edges: [
    {
      source: 'step-1',
      target: 'step-2',
    },
  ],
};

export const failingFlow: IFlow = {
  name: 'Failing Flow',
  steps: [
    {
      id: 'fail-step-1',
      type: 'http_request',
      name: 'fetchInvalidUrl',
      settings: { url: 'https://this-url-does-not-exist-12345.com/api' },
      retry: {
        maxAttempts: 3,
      },
    },
    {
      id: 'fail-step-2',
      type: 'json_minifier',
      name: 'minifyJson',
      settings: {
        jsonString: '{{steps.fetchInvalidUrl}}',
      },
    },
    {
      id: 'fail-step-3',
      type: 'log_message',
      name: 'neverLogMessageStep',
      settings: {
        message: 'This should never execute',
      },
    },
  ],
  edges: [
    {
      source: 'fail-step-1',
      target: 'fail-step-2',
    },
    {
      source: 'fail-step-2',
      target: 'fail-step-3',
    },
  ],
};

export const complexFlow: IFlow = {
  name: 'Streamly flow',
  steps: [
    {
      id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
      name: 'fetchTodos',
      label: 'fetchTodos',
      type: 'http_request',
      settings: {
        url: 'https://jsonplaceholder.typicode.com/todos',
      },
    },
    {
      id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
      name: 'filterCompleted',
      label: 'filterCompleted',
      type: 'filter_array',
      settings: {
        array: '{{steps.fetchTodos.data}}',
        field: 'completed',
        value: true,
        operator: '===',
        valueType: 'boolean',
      },
    },
    {
      id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
      name: 'sortByUserId',
      label: 'sortByUserId',
      type: 'sort_array',
      settings: {
        array: '{{steps.filterCompleted.filtered}}',
        field: 'userId',
        order: 'asc',
      },
    },
    {
      id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
      name: 'minifyTodos',
      label: 'minifyTodos',
      type: 'json_minifier',
      settings: {
        jsonString: '{{steps.sortByUserId.sorted}}',
      },
    },
    {
      id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
      name: 'waitBeforeUser',
      label: 'waitBeforeUser',
      type: 'delay',
      settings: {
        milliseconds: 1000,
      },
    },
    {
      id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
      name: 'fetchUser',
      label: 'fetchUser',
      type: 'http_request',
      settings: {
        url: 'https://jsonplaceholder.typicode.com/users/1',
      },
    },
    {
      id: 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d',
      name: 'formatUserName',
      label: 'formatUserName',
      type: 'string_format',
      settings: {
        text: '{{steps.fetchUser.name}}',
        operation: 'uppercase',
      },
    },
    {
      id: 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e',
      name: 'transformUser',
      label: 'transformUser',
      type: 'transform_data',
      settings: {
        mapping: {
          email: '{{steps.fetchUser.email}}',
          userId: '{{steps.fetchUser.id}}',
          fullName: '{{steps.formatUserName.formatted}}',
        },
      },
    },
    {
      id: 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f',
      name: 'encodeEmail',
      label: 'encodeEmail',
      type: 'base64_encode',
      settings: {
        text: '{{steps.transformUser.email}}',
      },
    },
    {
      id: 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a',
      name: 'decodeEmail',
      label: 'decodeEmail',
      type: 'base64_decode',
      settings: {
        encoded: '{{steps.encodeEmail.encoded}}',
      },
    },
    {
      id: '4e4d652a-cfbd-4427-b928-1589792cd076',
      name: 'log_message',
      label: 'Log summary',
      type: 'log_message',
      settings: {
        message: 'Show summary',
      },
    },
  ],
  edges: [
    {
      source: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
      target: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
    },
    {
      source: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
      target: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
    },
    {
      source: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
      target: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
    },
    {
      source: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
      target: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
    },
    {
      source: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
      target: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
    },
    {
      source: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
      target: 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d',
    },
    {
      source: 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d',
      target: 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e',
    },
    {
      source: 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e',
      target: 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f',
    },
    {
      source: 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f',
      target: 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a',
    },
    {
      source: 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a',
      target: '4e4d652a-cfbd-4427-b928-1589792cd076',
    },
  ],
  trigger: {
    type: 'http',
    enabled: false,
  },
};
