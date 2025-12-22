import { FilterArrayStep } from '../../src/steps/data-manipulation/filter-array/filter-array.service';
import { IContext } from '../../src/types';

describe('FilterArrayStep', () => {
  let step: FilterArrayStep;
  let ctx: IContext;

  beforeEach(() => {
    step = new FilterArrayStep();
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

  it('should filter array with === operator', async () => {
    const settings = {
      array: [
        { id: 1, status: 'active' },
        { id: 2, status: 'inactive' },
        { id: 3, status: 'active' },
      ],
      field: 'status',
      operator: '===',
      value: 'active',
    };

    const result = await step.run(ctx, settings);

    expect(result.filtered).toHaveLength(2);
    expect(result.count).toBe(2);
    expect(result.filtered[0].id).toBe(1);
    expect(result.filtered[1].id).toBe(3);
  });

  it('should filter array with !== operator', async () => {
    const settings = {
      array: [
        { id: 1, status: 'active' },
        { id: 2, status: 'inactive' },
      ],
      field: 'status',
      operator: '!==',
      value: 'active',
    };

    const result = await step.run(ctx, settings);

    expect(result.filtered).toHaveLength(1);
    expect(result.filtered[0].id).toBe(2);
  });

  it('should filter array with > operator', async () => {
    const settings = {
      array: [
        { id: 1, score: 50 },
        { id: 2, score: 75 },
        { id: 3, score: 90 },
      ],
      field: 'score',
      operator: '>',
      value: 60,
    };

    const result = await step.run(ctx, settings);

    expect(result.filtered).toHaveLength(2);
    expect(result.filtered[0].score).toBe(75);
    expect(result.filtered[1].score).toBe(90);
  });

  it('should filter array with < operator', async () => {
    const settings = {
      array: [
        { id: 1, score: 50 },
        { id: 2, score: 75 },
      ],
      field: 'score',
      operator: '<',
      value: 60,
    };

    const result = await step.run(ctx, settings);

    expect(result.filtered).toHaveLength(1);
    expect(result.filtered[0].score).toBe(50);
  });

  it('should filter array with >= operator', async () => {
    const settings = {
      array: [
        { id: 1, score: 50 },
        { id: 2, score: 75 },
        { id: 3, score: 75 },
      ],
      field: 'score',
      operator: '>=',
      value: 75,
    };

    const result = await step.run(ctx, settings);

    expect(result.filtered).toHaveLength(2);
  });

  it('should filter array with <= operator', async () => {
    const settings = {
      array: [
        { id: 1, score: 50 },
        { id: 2, score: 75 },
      ],
      field: 'score',
      operator: '<=',
      value: 50,
    };

    const result = await step.run(ctx, settings);

    expect(result.filtered).toHaveLength(1);
    expect(result.filtered[0].score).toBe(50);
  });

  it('should return all items with unknown operator', async () => {
    const settings = {
      array: [{ id: 1 }, { id: 2 }],
      field: 'id',
      operator: 'unknown',
      value: 1,
    };

    const result = await step.run(ctx, settings);

    expect(result.filtered).toHaveLength(2);
  });

  it('should add log entry', async () => {
    const settings = {
      array: [{ id: 1 }],
      field: 'id',
      operator: '===',
      value: 1,
    };

    await step.run(ctx, settings);

    expect(ctx.logs).toHaveLength(1);
    expect(ctx.logs[0]).toContain('Filtering array');
  });
});
