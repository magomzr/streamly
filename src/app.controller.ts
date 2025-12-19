import { Controller, Get } from '@nestjs/common';
import { EngineService } from './engine/engine.service';
import { generateUUID } from './utils';

@Controller()
export class AppController {
  constructor(private readonly engineService: EngineService) {}

  @Get()
  getHello(): any {
    return this.engineService.runFlow(sampleFlow, vars);
  }

  @Get('fail')
  testFailure(): any {
    return this.engineService.runFlow(sampleFlow2, vars);
  }
}

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

export const sampleFlow2 = {
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
