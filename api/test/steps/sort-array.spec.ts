import { SortArrayStep } from '../../src/steps/data-manipulation/sort-array/sort-array.service';
import { IContext } from '../../src/types';

describe('SortArrayStep', () => {
  let step: SortArrayStep;
  let ctx: IContext;

  beforeEach(() => {
    step = new SortArrayStep();
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

  it('should sort array in ascending order by default', async () => {
    const settings = {
      array: [
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ],
      field: 'id',
    };

    const result = await step.run(ctx, settings);

    expect(result.sorted).toHaveLength(3);
    expect(result.sorted[0].id).toBe(1);
    expect(result.sorted[1].id).toBe(2);
    expect(result.sorted[2].id).toBe(3);
  });

  it('should sort array in ascending order explicitly', async () => {
    const settings = {
      array: [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }],
      field: 'name',
      order: 'asc',
    };

    const result = await step.run(ctx, settings);

    expect(result.sorted[0].name).toBe('Alice');
    expect(result.sorted[1].name).toBe('Bob');
    expect(result.sorted[2].name).toBe('Charlie');
  });

  it('should sort array in descending order', async () => {
    const settings = {
      array: [{ score: 50 }, { score: 90 }, { score: 75 }],
      field: 'score',
      order: 'desc',
    };

    const result = await step.run(ctx, settings);

    expect(result.sorted[0].score).toBe(90);
    expect(result.sorted[1].score).toBe(75);
    expect(result.sorted[2].score).toBe(50);
  });

  it('should not mutate original array', async () => {
    const original = [{ id: 3 }, { id: 1 }, { id: 2 }];
    const settings = {
      array: original,
      field: 'id',
      order: 'asc',
    };

    await step.run(ctx, settings);

    expect(original[0].id).toBe(3);
  });

  it('should return count of sorted items', async () => {
    const settings = {
      array: [{ id: 1 }, { id: 2 }, { id: 3 }],
      field: 'id',
    };

    const result = await step.run(ctx, settings);

    expect(result.count).toBe(3);
  });

  it('should add log entry', async () => {
    const settings = {
      array: [{ id: 1 }],
      field: 'id',
      order: 'asc',
    };

    await step.run(ctx, settings);

    expect(ctx.logs).toHaveLength(1);
    expect(ctx.logs[0]).toContain('Sorting array');
  });
});
