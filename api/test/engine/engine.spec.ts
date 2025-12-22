import { Engine } from '../../src/engine/engine';
import { IStepRegistry, IFlow, IStepExecutor, IContext } from '../../src/types';

class TestStep implements IStepExecutor {
  static stepType = 'test_step';
  async run(ctx: IContext, settings: any): Promise<any> {
    return { data: settings.value };
  }
}

describe('Engine', () => {
  let engine: Engine;
  let registry: IStepRegistry;

  beforeEach(() => {
    registry = {
      register: jest.fn(),
      resolve: jest.fn(() => TestStep),
    };
    engine = new Engine(registry);
  });

  it('should execute flow and return context', async () => {
    const flow: IFlow = {
      name: 'Test Flow',
      steps: [
        {
          id: 'step-1',
          name: 'testStep',
          type: 'test_step' as any,
          settings: { value: 'hello' },
        },
      ],
    };

    const result = await engine.execute(flow, { userId: 123 });

    expect(result).toBeDefined();
    expect(result.name).toBe('Test Flow');
    expect(result.status).toBe('completed');
    expect(result.vars.userId).toBe(123);
  });

  it('should pass flow to executor', async () => {
    const flow: IFlow = {
      name: 'Another Flow',
      steps: [],
    };

    const result = await engine.execute(flow, {});

    expect(result.name).toBe('Another Flow');
  });
});
