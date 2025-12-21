import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { EngineService } from './engine/engine.service';
import type { IContext, IFlow } from './types';

describe('AppController', () => {
  let controller: AppController;
  let engineService: EngineService;

  const mockContext: IContext = {
    id: '123',
    name: 'Custom Flow',
    vars: {},
    steps: {},
    logs: [],
    status: 'completed',
    startedAt: new Date(),
    completedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: EngineService,
          useValue: {
            runFlow: jest.fn().mockResolvedValue(mockContext),
          },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    engineService = module.get<EngineService>(EngineService);
  });

  describe('POST /run', () => {
    it('should execute flow from request body', async () => {
      const body = {
        flow: {
          name: 'Custom Flow',
          steps: [
            {
              id: 'step-1',
              name: 'fetchData',
              type: 'http_request' as const,
              settings: { url: 'https://api.example.com/data' },
            },
          ],
        } as IFlow,
        vars: { phoneNumber: '+1234567890' },
      };

      const result = await controller.runFlow(body);

      expect(result).toBeDefined();
      expect(result.status).toBe('completed');
      expect(engineService.runFlow).toHaveBeenCalledWith(body.flow, body.vars);
    });

    it('should use empty vars if not provided', async () => {
      const body = {
        flow: {
          name: 'Custom Flow',
          steps: [],
        },
      };

      await controller.runFlow(body);

      expect(engineService.runFlow).toHaveBeenCalledWith(body.flow, {});
    });

    it('should return context with all required properties', async () => {
      const body = {
        flow: { name: 'Test', steps: [] },
        vars: {},
      };

      const result = await controller.runFlow(body);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('vars');
      expect(result).toHaveProperty('steps');
      expect(result).toHaveProperty('logs');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('startedAt');
    });
  });
});
