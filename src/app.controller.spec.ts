import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { EngineService } from './engine/engine.service';
import { IContext } from './types';

describe('AppController', () => {
  let appController: AppController;
  let engineService: EngineService;

  const mockContext: IContext = {
    id: '123',
    name: 'Test Flow',
    vars: { phoneNumber: '+57 300 123 4567' },
    steps: {
      fetchTodo: { id: 1, title: 'Test Todo', completed: true },
      notifyCompleted: { sent: true, message: 'Todo is completed: Test Todo' },
    },
    logs: [
      '[INFO] 2025-01-01T00:00:00.000Z Executor: Starting flow: Test Flow',
      '[INFO] 2025-01-01T00:00:00.000Z Executor: Flow Test Flow completed successfully.',
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
          name: expect.any(String),
          steps: expect.any(Array),
        }),
        expect.objectContaining({
          phoneNumber: expect.any(String),
        }),
      );
    });

    it('should return completed status on success', async () => {
      const result = await appController.getHello();

      expect(result.status).toBe('completed');
      expect(result.completedAt).toBeDefined();
    });

    it('should have steps output in context', async () => {
      const result = await appController.getHello();

      expect(result.steps).toBeDefined();
      expect(typeof result.steps).toBe('object');
    });

    it('should have logs array in context', async () => {
      const result = await appController.getHello();

      expect(result.logs).toBeDefined();
      expect(Array.isArray(result.logs)).toBe(true);
    });

    it('should have vars with phoneNumber', async () => {
      const result = await appController.getHello();

      expect(result.vars).toBeDefined();
      expect(result.vars.phoneNumber).toBeDefined();
    });
  });

  describe('Flow execution with branches', () => {
    it('should handle conditional branching', async () => {
      const branchContext: IContext = {
        ...mockContext,
        steps: {
          fetchTodo: { id: 1, title: 'Test Todo', completed: true },
          notifyCompleted: { sent: true, message: 'Todo is completed: Test Todo' },
        },
      };

      jest.spyOn(engineService, 'runFlow').mockResolvedValue(branchContext);

      const result = await appController.getHello();

      expect(result.steps.fetchTodo).toBeDefined();
      expect(result.steps.notifyCompleted).toBeDefined();
    });

    it('should execute default branch when condition is false', async () => {
      const defaultBranchContext: IContext = {
        ...mockContext,
        steps: {
          fetchTodo: { id: 1, title: 'Test Todo', completed: false },
          notifyPending: { sent: true, message: 'Todo is pending: Test Todo' },
        },
      };

      jest.spyOn(engineService, 'runFlow').mockResolvedValue(defaultBranchContext);

      const result = await appController.getHello();

      expect(result.steps.fetchTodo).toBeDefined();
      expect(result.steps.notifyPending).toBeDefined();
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
  });
});
