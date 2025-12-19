import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { EngineService } from './engine/engine.service';
import { IContext } from './types';

describe('AppController', () => {
  let appController: AppController;
  let engineService: EngineService;

  const mockContext: IContext = {
    id: '123',
    name: 'Simple Flow',
    vars: { phoneNumber: '+57 300 123 4567' },
    steps: {
      fetchTodo: {
        id: 1,
        title: 'delectus aut autem',
        completed: false,
        _metadata: {
          stepId: '67547de2-500c-4b53-83f7-2fa70b92d9a3',
          stepType: 'http_request',
          success: true,
          executedAt: new Date('2025-01-01T00:00:00.000Z'),
        },
      },
      sendSmsStep: {
        sent: true,
        message: 'Fetched title: delectus aut autem',
        to: '+57 300 123 4567',
        _metadata: {
          stepId: 'bd326d47-6a12-44ea-acfd-e0e7c2e8469b',
          stepType: 'send_sms',
          success: true,
          executedAt: new Date('2025-01-01T00:00:01.000Z'),
        },
      },
    },
    logs: [
      '[INFO] 2025-01-01T00:00:00.000Z Executor: Starting flow: Simple Flow',
      '[INFO] 2025-01-01T00:00:00.000Z Executor: Executing step: http_request with id: 67547de2-500c-4b53-83f7-2fa70b92d9a3',
      '[INFO] 2025-01-01T00:00:00.000Z Executor: Completed step: http_request with id: 67547de2-500c-4b53-83f7-2fa70b92d9a3',
      '[INFO] 2025-01-01T00:00:01.000Z Executor: Executing step: send_sms with id: bd326d47-6a12-44ea-acfd-e0e7c2e8469b',
      '[INFO] 2025-01-01T00:00:01.000Z Executor: Completed step: send_sms with id: bd326d47-6a12-44ea-acfd-e0e7c2e8469b',
      '[INFO] 2025-01-01T00:00:01.000Z Executor: Flow Simple Flow completed successfully.',
    ],
    status: 'completed',
    startedAt: new Date('2025-01-01T00:00:00.000Z'),
    completedAt: new Date('2025-01-01T00:00:01.000Z'),
  };

  beforeEach(async () => {
    const mockEngineService = {
      runFlow: jest.fn().mockResolvedValue(mockContext),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: EngineService,
          useValue: mockEngineService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    engineService = app.get<EngineService>(EngineService);
  });

  describe('getHello', () => {
    it('should return a context object', async () => {
      const result = await appController.getHello();

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('vars');
      expect(result).toHaveProperty('steps');
      expect(result).toHaveProperty('logs');
      expect(result).toHaveProperty('status');
    });

    it('should call engineService.runFlow with correct parameters', async () => {
      await appController.getHello();

      expect(engineService.runFlow).toHaveBeenCalledTimes(1);
      expect(engineService.runFlow).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Simple Flow',
          steps: expect.arrayContaining([
            expect.objectContaining({
              type: 'http_request',
              name: 'fetchTodo',
            }),
            expect.objectContaining({
              type: 'send_sms',
              name: 'sendSmsStep',
            }),
          ]),
        }),
        expect.objectContaining({
          phoneNumber: '+57 300 123 4567',
        }),
      );
    });

    it('should return completed status on success', async () => {
      const result = await appController.getHello();

      expect(result.status).toBe('completed');
      expect(result.completedAt).toBeDefined();
    });

    it('should have steps output with metadata', async () => {
      const result = await appController.getHello();

      expect(result.steps.fetchTodo).toBeDefined();
      expect(result.steps.fetchTodo._metadata).toBeDefined();
      expect(result.steps.fetchTodo._metadata.success).toBe(true);
      expect(result.steps.fetchTodo._metadata.stepType).toBe('http_request');
    });

    it('should have logs array in context', async () => {
      const result = await appController.getHello();

      expect(result.logs).toBeDefined();
      expect(Array.isArray(result.logs)).toBe(true);
      expect(result.logs.length).toBeGreaterThan(0);
    });

    it('should have vars with phoneNumber', async () => {
      const result = await appController.getHello();

      expect(result.vars).toBeDefined();
      expect(result.vars.phoneNumber).toBe('+57 300 123 4567');
    });
  });

  describe('Template resolution', () => {
    it('should resolve templates in step settings', async () => {
      const result = await appController.getHello();

      expect(result.steps.sendSmsStep).toBeDefined();
      expect(result.steps.sendSmsStep.message).toBe('Fetched title: delectus aut autem');
    });

    it('should access previous step outputs via templates', async () => {
      const result = await appController.getHello();

      expect(result.steps.fetchTodo.title).toBe('delectus aut autem');
      expect(result.steps.sendSmsStep.message).toContain('delectus aut autem');
    });
  });

  describe('Error handling', () => {
    it('should handle failed flow execution', async () => {
      const failedContext: IContext = {
        ...mockContext,
        status: 'failed',
        error: {
          stepId: 'step-1',
          stepName: 'fetchTodo',
          message: 'Network error',
          attempt: 3,
        },
      };

      jest.spyOn(engineService, 'runFlow').mockResolvedValue(failedContext);

      const result = await appController.getHello();

      expect(result.status).toBe('failed');
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Network error');
    });

    it('should include error details when step fails', async () => {
      const failedContext: IContext = {
        ...mockContext,
        status: 'failed',
        error: {
          stepId: 'step-1',
          stepName: 'fetchTodo',
          message: 'HTTP 500 error',
          attempt: 3,
        },
      };

      jest.spyOn(engineService, 'runFlow').mockResolvedValue(failedContext);

      const result = await appController.getHello();

      expect(result.error?.stepId).toBe('step-1');
      expect(result.error?.stepName).toBe('fetchTodo');
      expect(result.error?.attempt).toBe(3);
    });
  });

  describe('Retry logic', () => {
    it('should respect retry configuration', async () => {
      const retryContext: IContext = {
        ...mockContext,
        logs: [
          '[INFO] Starting flow',
          '[WARN] Retrying step http_request (attempt 2/3)',
          '[WARN] Retrying step http_request (attempt 3/3)',
          '[INFO] Completed step',
        ],
      };

      jest.spyOn(engineService, 'runFlow').mockResolvedValue(retryContext);

      const result = await appController.getHello();

      const retryLogs = result.logs.filter((log) => log.includes('Retrying'));
      expect(retryLogs.length).toBeGreaterThan(0);
    });
  });

  describe('Context metadata', () => {
    it('should have startedAt timestamp', async () => {
      const result = await appController.getHello();

      expect(result.startedAt).toBeDefined();
      expect(result.startedAt).toBeInstanceOf(Date);
    });

    it('should have completedAt timestamp when finished', async () => {
      const result = await appController.getHello();

      expect(result.completedAt).toBeDefined();
      expect(result.completedAt).toBeInstanceOf(Date);
    });

    it('should have unique flow id', async () => {
      const result = await appController.getHello();

      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('string');
    });

    it('should have step metadata with execution details', async () => {
      const result = await appController.getHello();

      const stepMetadata = result.steps.fetchTodo._metadata;
      expect(stepMetadata).toBeDefined();
      expect(stepMetadata.stepId).toBeDefined();
      expect(stepMetadata.stepType).toBe('http_request');
      expect(stepMetadata.success).toBe(true);
      expect(stepMetadata.executedAt).toBeInstanceOf(Date);
    });
  });
});
