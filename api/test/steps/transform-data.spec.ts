import { TransformDataStep } from '../../src/steps/data-manipulation/transform-data/transform-data.service';
import { IContext } from '../../src/types';

describe('TransformDataStep', () => {
  let step: TransformDataStep;
  let ctx: IContext;

  beforeEach(() => {
    step = new TransformDataStep();
    ctx = {
      id: '123',
      name: 'Test',
      vars: {},
      steps: {},
      logs: [],
      status: 'running',
      startedAt: new Date(),
    };
  });

  it('should return mapping object', async () => {
    const settings = {
      mapping: {
        userId: 123,
        userName: 'John Doe',
        email: 'john@example.com',
      },
    };

    const result = await step.run(ctx, settings);

    expect(result).toEqual(settings.mapping);
  });

  it('should handle nested objects', async () => {
    const settings = {
      mapping: {
        user: {
          id: 1,
          profile: {
            name: 'Alice',
            age: 30,
          },
        },
      },
    };

    const result = await step.run(ctx, settings);

    expect(result.user.profile.name).toBe('Alice');
  });

  it('should handle arrays', async () => {
    const settings = {
      mapping: {
        items: [1, 2, 3],
        tags: ['a', 'b', 'c'],
      },
    };

    const result = await step.run(ctx, settings);

    expect(result.items).toEqual([1, 2, 3]);
    expect(result.tags).toEqual(['a', 'b', 'c']);
  });

  it('should add log entry', async () => {
    const settings = {
      mapping: { key: 'value' },
    };

    await step.run(ctx, settings);

    expect(ctx.logs).toHaveLength(1);
    expect(ctx.logs[0]).toContain('Transforming data');
  });
});
