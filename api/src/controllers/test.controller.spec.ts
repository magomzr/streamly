import { Test, TestingModule } from '@nestjs/testing';
import { TestController } from './test.controller';
import { EngineService } from '../engine/engine.service';
import { IContext } from '../types';

describe('TestController', () => {
  let controller: TestController;
  let engineService: EngineService;

  const mockContext: IContext = {
    id: '123',
    name: 'Test Flow',
    vars: { phoneNumber: '+57 300 123 4567' },
    steps: {},
    logs: ['[INFO] Flow completed'],
    status: 'completed',
    startedAt: new Date(),
    completedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
      providers: [
        {
          provide: EngineService,
          useValue: {
            runFlow: jest.fn().mockResolvedValue(mockContext),
          },
        },
      ],
    }).compile();

    controller = module.get<TestController>(TestController);
    engineService = module.get<EngineService>(EngineService);
  });

  describe('GET /test/simple', () => {
    it('should execute simple test flow', async () => {
      const result = await controller.testSimple();

      expect(result).toBeDefined();
      expect(result.status).toBe('completed');
      expect(engineService.runFlow).toHaveBeenCalled();
    });
  });

  describe('GET /test/fail', () => {
    it('should execute failing test flow', async () => {
      const failedContext: IContext = {
        ...mockContext,
        status: 'failed',
        error: {
          stepId: 'step-1',
          stepName: 'fetchInvalidUrl',
          message: 'fetch failed',
          attempt: 3,
        },
      };

      jest.spyOn(engineService, 'runFlow').mockResolvedValue(failedContext);

      const result = await controller.testFailure();

      expect(result.status).toBe('failed');
      expect(result.error).toBeDefined();
    });
  });

  describe('GET /test/complex', () => {
    it('should execute complex test flow', async () => {
      const complexContext: IContext = {
        ...mockContext,
        steps: {
          fetchTodo: { id: 1, _metadata: {} },
          minifyTodo: { minifiedJson: '{}', _metadata: {} },
          fetchUser: { id: 1, _metadata: {} },
          minifyUser: { minifiedJson: '{}', _metadata: {} },
          sendSummary: { sent: true, _metadata: {} },
        },
      };

      jest.spyOn(engineService, 'runFlow').mockResolvedValue(complexContext);

      const result = await controller.testComplex();

      expect(result.steps).toBeDefined();
      expect(Object.keys(result.steps).length).toBe(5);
    });
  });
});
