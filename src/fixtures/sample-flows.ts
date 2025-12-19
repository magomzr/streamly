import { generateUUID } from '../utils';

export const vars = {
  phoneNumber: '+57 300 123 4567',
};

export const sampleFlow = {
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
      type: 'send_sms',
      name: 'sendSmsStep',
      settings: {
        message: 'Fetched title: {{steps.fetchTodo.title}}',
      },
      retry: {
        maxAttempts: 2,
      },
    },
  ],
};

export const failingFlow = {
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
      type: 'send_sms',
      name: 'sendSmsStep',
      settings: {
        message: 'This should never execute',
      },
    },
  ],
};

export const complexFlow = {
  name: 'Complex Flow - All Steps',
  steps: [
    {
      id: generateUUID(),
      type: 'http_request',
      name: 'fetchTodo',
      settings: { url: 'https://jsonplaceholder.typicode.com/todos/1' },
    },
    {
      id: generateUUID(),
      type: 'json_minifier',
      name: 'minifyTodo',
      settings: {
        jsonString: '{{steps.fetchTodo}}',
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
      type: 'transform_data',
      name: 'transformUser',
      settings: {
        mapping: {
          userId: '{{steps.fetchUser.id}}',
          fullName: '{{steps.fetchUser.name}}',
          email: '{{steps.fetchUser.email}}',
        },
      },
    },
    {
      id: generateUUID(),
      type: 'webhook',
      name: 'sendWebhook',
      settings: {
        url: 'https://jsonplaceholder.typicode.com/posts',
        payload: {
          todo: '{{steps.fetchTodo.title}}',
          user: '{{steps.transformUser.fullName}}',
        },
      },
    },
    {
      id: generateUUID(),
      type: 'send_sms',
      name: 'sendSummary',
      settings: {
        message:
          'Todo: {{steps.fetchTodo.title}}, User: {{steps.transformUser.fullName}}',
      },
    },
  ],
};
