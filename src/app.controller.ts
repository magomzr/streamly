import { Controller, Get } from '@nestjs/common';
import { EngineService } from './engine/engine.service';

@Controller()
export class AppController {
  constructor(private readonly engineService: EngineService) {}

  @Get()
  getHello(): any {
    return this.engineService.runFlow(sampleFlow, {});
  }
}

export const sampleFlow = {
  name: 'Dummy flow',
  steps: [
    {
      id: '67547de2-500c-4b53-83f7-2fa70b92d9a3',
      type: 'http_request',
      name: 'fetchTodo',
      settings: { url: 'https://jsonplaceholder.typicode.com/todos/1' },
    },
    {
      id: 'bd326d47-6a12-44ea-acfd-e0e7c2e8469b',
      type: 'send_sms',
      name: 'sendSmsStep',
      settings: {
        message: 'Fetched title: {{steps.fetchTodo.title}}',
      },
    }
  ],
};
