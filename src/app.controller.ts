import { Controller, Get } from '@nestjs/common';
import { EngineService } from './engine/engine.service';

@Controller()
export class AppController {
  constructor(private readonly engineService: EngineService) {}

  @Get()
  getHello(): any {
    return this.engineService.runFlow(sampleFlow, vars);
  }
}

export const vars = {
  phoneNumber: '+57 300 123 4567',
};

export const simpleFlow = {
  name: 'Simple Flow',
  steps: [
    {
      id: '67547de2-500c-4b53-83f7-2fa70b92d9a3',
      type: 'http_request',
      name: 'fetchTodo',
      settings: { url: 'https://jsonplaceholder.typicode.com/todos/1' },
      retry: {
        maxAttempts: 3,
      },
    },
    {
      id: 'bd326d47-6a12-44ea-acfd-e0e7c2e8469b',
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

export const sampleFlow = {
  name: 'Conditional Flow',
  steps: [
    {
      id: '67547de2-500c-4b53-83f7-2fa70b92d9a3',
      type: 'http_request',
      name: 'fetchTodo',
      settings: { url: 'https://jsonplaceholder.typicode.com/todos/1' },
      retry: {
        maxAttempts: 3,
      },
    },
    {
      id: 'router-1',
      type: 'router',
      name: 'checkCompleted',
      branches: [
        {
          condition: '{{steps.fetchTodo.completed}} === true',
          steps: [
            {
              id: 'branch-a-1',
              type: 'send_sms',
              name: 'notifyCompleted',
              settings: {
                message: 'Todo is completed: {{steps.fetchTodo.title}}',
              },
            },
          ],
        },
        {
          condition: 'default',
          steps: [
            {
              id: 'branch-b-1',
              type: 'send_sms',
              name: 'notifyPending',
              settings: {
                message: 'Todo is pending: {{steps.fetchTodo.title}}',
              },
            },
          ],
        },
      ],
    },
  ],
};
