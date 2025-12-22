import { Executor } from '../../src/engine/executor';
import { IStepRegistry, IContext, IFlow, IStepExecutor } from '../../src/types';

class MockStep implements IStepExecutor {
  static stepType = 'mock_step';
  async run(ctx: IContext, settings: any): Promise<any> {
    return { result: 'success', input: settings };
  }
}

class FailingStep implements IStepExecutor {
  static stepType = 'failing_step';
  async run(): Promise<any> {
    throw new Error('Step failed');
  }
}

describe('Executor', () => {
  let executor: Executor;
  let registry: IStepRegistry;

  beforeEach(() => {
    registry = {
      register: jest.fn(),
      resolve: jest.fn((type: string) => {
        if (type === 'mock_step') return MockStep;
        if (type === 'failing_step') return FailingStep;
        throw new Error(`Unknown step type: ${type}`);
      }),
    };
    executor = new Executor(registry);
  });

  it('should execute flow successfully', async () => {
    const flow: IFlow = {
      name: 'Test Flow',
      steps: [
        {
          id: 'step-1',
          name: 'testStep',
          type: 'mock_step' as any,
          settings: { value: 'test' },
        },
      ],
    };

    const result = await executor.run(flow, {});

    expect(result.status).toBe('completed');
    expect(result.steps.testStep.result).toBe('success');
    expect(result.completedAt).toBeDefined();
  });

  it('should store step output with metadata', async () => {
    const flow: IFlow = {
      name: 'Test Flow',
      steps: [
        {
          id: 'step-1',
          name: 'myStep',
          type: 'mock_step' as any,
          settings: {},
        },
      ],
    };

    const result = await executor.run(flow, {});

    expect(result.steps.myStep._metadata).toBeDefined();
    expect(result.steps.myStep._metadata.stepId).toBe('step-1');
    expect(result.steps.myStep._metadata.stepType).toBe('mock_step');
    expect(result.steps.myStep._metadata.success).toBe(true);
  });

  it('should pass vars to context', async () => {
    const flow: IFlow = {
      name: 'Test Flow',
      steps: [],
    };

    const result = await executor.run(flow, { userId: 123 });

    expect(result.vars.userId).toBe(123);
  });

  it('should handle step failure', async () => {
    const flow: IFlow = {
      name: 'Test Flow',
      steps: [
        {
          id: 'step-1',
          name: 'failStep',
          type: 'failing_step' as any,
          settings: {},
        },
      ],
    };

    const result = await executor.run(flow, {});

    expect(result.status).toBe('failed');
    expect(result.error).toBeDefined();
    expect(result.error!.stepId).toBe('step-1');
    expect(result.error!.message).toBe('Step failed');
  });

  it('should retry failed steps', async () => {
    let attemptCount = 0;
    class RetryStep implements IStepExecutor {
      static stepType = 'retry_step';
      async run(): Promise<any> {
        attemptCount++;
        if (attemptCount < 3) {
          throw new Error('Retry needed');
        }
        return { success: true };
      }
    }

    registry.resolve = jest.fn(() => RetryStep);

    const flow: IFlow = {
      name: 'Test Flow',
      steps: [
        {
          id: 'step-1',
          name: 'retryStep',
          type: 'retry_step' as any,
          settings: {},
          retry: { maxAttempts: 3 },
        },
      ],
    };

    const result = await executor.run(flow, {});

    expect(result.status).toBe('completed');
    expect(attemptCount).toBe(3);
  });

  it('should add logs for each step', async () => {
    const flow: IFlow = {
      name: 'Test Flow',
      steps: [
        {
          id: 'step-1',
          name: 'step1',
          type: 'mock_step' as any,
          settings: {},
        },
      ],
    };

    const result = await executor.run(flow, {});

    expect(result.logs.length).toBeGreaterThan(0);
    expect(result.logs.some((log) => log.includes('Starting flow'))).toBe(true);
    expect(result.logs.some((log) => log.includes('Executing step'))).toBe(
      true,
    );
    expect(result.logs.some((log) => log.includes('Completed step'))).toBe(
      true,
    );
  });

  it('should handle array output from step', async () => {
    class ArrayStep implements IStepExecutor {
      static stepType = 'array_step';
      async run(): Promise<any> {
        return [1, 2, 3];
      }
    }

    registry.resolve = jest.fn(() => ArrayStep);

    const flow: IFlow = {
      name: 'Test Flow',
      steps: [
        {
          id: 'step-1',
          name: 'arrayStep',
          type: 'array_step' as any,
          settings: {},
        },
      ],
    };

    const result = await executor.run(flow, {});

    expect(Array.isArray(result.steps.arrayStep)).toBe(true);
    expect(result.steps.arrayStep.length).toBe(3);
    expect(result.steps.arrayStep[0]).toBe(1);
    expect(result.steps.arrayStep[1]).toBe(2);
    expect(result.steps.arrayStep[2]).toBe(3);
    expect(result.steps.arrayStep._metadata).toBeDefined();
  });

  it('should handle primitive output from step', async () => {
    class PrimitiveStep implements IStepExecutor {
      static stepType = 'primitive_step';
      async run(): Promise<any> {
        return 42;
      }
    }

    registry.resolve = jest.fn(() => PrimitiveStep);

    const flow: IFlow = {
      name: 'Test Flow',
      steps: [
        {
          id: 'step-1',
          name: 'primitiveStep',
          type: 'primitive_step' as any,
          settings: {},
        },
      ],
    };

    const result = await executor.run(flow, {});

    expect(result.steps.primitiveStep.value).toBe(42);
    expect(result.steps.primitiveStep._metadata).toBeDefined();
  });
});
