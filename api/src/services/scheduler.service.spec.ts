import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { FlowService } from './flow.service';
import { ExecutionService } from './execution.service';
import { EngineService } from '../engine/engine.service';

describe('SchedulerService', () => {
  let service: SchedulerService;

  const mockFlowService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  const mockExecutionService = {
    create: jest.fn(),
  };

  const mockEngineService = {
    runFlow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        { provide: FlowService, useValue: mockFlowService },
        { provide: ExecutionService, useValue: mockExecutionService },
        { provide: EngineService, useValue: mockEngineService },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate cron expression', () => {
    const validCron = '*/5 * * * *';
    expect(() => service.scheduleFlow('test-id', validCron)).not.toThrow();
  });

  it('should unschedule flow', () => {
    const flowId = 'test-flow';
    service.scheduleFlow(flowId, '*/5 * * * *');
    service.unscheduleFlow(flowId);
    expect(service.getScheduledFlows()).not.toContain(flowId);
  });
});
