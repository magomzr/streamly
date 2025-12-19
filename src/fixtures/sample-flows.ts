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
  name: 'Complex Flow - Multiple HTTP & Minify',
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
      type: 'http_request',
      name: 'fetchUser',
      settings: { url: 'https://jsonplaceholder.typicode.com/users/1' },
    },
    {
      id: generateUUID(),
      type: 'json_minifier',
      name: 'minifyUser',
      settings: {
        jsonString: '{{steps.fetchUser}}',
      },
    },
    {
      id: generateUUID(),
      type: 'send_sms',
      name: 'sendSummary',
      settings: {
        message: 'Todo: {{steps.minifyTodo.minifiedJson}}, User: {{steps.minifyUser.minifiedJson}}',
      },
    },
  ],
};
