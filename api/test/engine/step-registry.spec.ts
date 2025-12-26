import { StepRegistry } from '../../src/registry/stepRegistry';
import { IStepConstructor } from '../../src/types';

class MockStep {
  static readonly stepType = 'mock_step';
  async run() {
    return {};
  }
}

class AnotherStep {
  static readonly stepType = 'another_step';
  async run() {
    return {};
  }
}

describe('StepRegistry', () => {
  let registry: StepRegistry;

  beforeEach(() => {
    registry = new StepRegistry();
  });

  it('should register a step', () => {
    registry.register(MockStep as IStepConstructor);

    const resolved = registry.resolve('mock_step');

    expect(resolved).toBe(MockStep);
  });

  it('should register multiple steps', () => {
    registry.register(MockStep as IStepConstructor);
    registry.register(AnotherStep as IStepConstructor);

    expect(registry.resolve('mock_step')).toBe(MockStep);
    expect(registry.resolve('another_step')).toBe(AnotherStep);
  });

  it('should throw error for unknown step type', () => {
    expect(() => registry.resolve('unknown_step')).toThrow(
      'Unknown step type: unknown_step',
    );
  });

  it('should overwrite step if registered twice', () => {
    class UpdatedMockStep {
      static readonly stepType = 'mock_step';
      async run() {
        return { updated: true };
      }
    }

    registry.register(MockStep as IStepConstructor);
    registry.register(UpdatedMockStep as IStepConstructor);

    const resolved = registry.resolve('mock_step');

    expect(resolved).toBe(UpdatedMockStep);
  });
});
