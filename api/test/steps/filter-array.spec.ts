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

  it('should filter by boolean true', async () => {
    const settings = {
      array: [
        { id: 1, completed: true },
        { id: 2, completed: false },
        { id: 3, completed: true },
      ],
      field: 'completed',
      operator: '===',
      value: 'true',
      valueType: 'boolean',
    };

    const result = await step.run(ctx, settings);

    expect(result.filtered).toHaveLength(2);
    expect(result.filtered[0].id).toBe(1);
    expect(result.filtered[1].id).toBe(3);
  });

  it('should filter by boolean false', async () => {
    const settings = {
      array: [
        { id: 1, completed: true },
        { id: 2, completed: false },
      ],
      field: 'completed',
      operator: '===',
      value: 'false',
      valueType: 'boolean',
    };

    const result = await step.run(ctx, settings);

    expect(result.filtered).toHaveLength(1);
    expect(result.filtered[0].id).toBe(2);
  });

  it('should filter with contains operator on string', async () => {
    const settings = {
      array: [
        { id: 1, email: 'john@example.com' },
        { id: 2, email: 'jane@test.com' },
        { id: 3, email: 'bob@example.com' },
      ],
      field: 'email',
      operator: 'contains',
      value: 'example',
    };

    const result = await step.run(ctx, settings);

    expect(result.filtered).toHaveLength(2);
    expect(result.filtered[0].id).toBe(1);
    expect(result.filtered[1].id).toBe(3);
  });

  it('should filter with contains operator on array', async () => {
    const settings = {
      array: [
        { id: 1, tags: ['javascript', 'react'] },
        { id: 2, tags: ['python', 'django'] },
        { id: 3, tags: ['javascript', 'vue'] },
      ],
      field: 'tags',
      operator: 'contains',
      value: 'javascript',
    };

    const result = await step.run(ctx, settings);

    expect(result.filtered).toHaveLength(2);
    expect(result.filtered[0].id).toBe(1);
    expect(result.filtered[1].id).toBe(3);
  });

  it('should parse number strings correctly', async () => {
    const settings = {
      array: [
        { id: 1, age: 25 },
        { id: 2, age: 30 },
        { id: 3, age: 35 },
      ],
      field: 'age',
      operator: '>',
      value: '28',
      valueType: 'number',
    };

    const result = await step.run(ctx, settings);

    expect(result.filtered).toHaveLength(2);
  });

  it('should handle null values', async () => {
    const settings = {
      array: [
        { id: 1, value: null },
        { id: 2, value: 'test' },
      ],
      field: 'value',
      operator: '===',
      value: 'null',
      valueType: 'null',
    };

    const result = await step.run(ctx, settings);

    expect(result.filtered).toHaveLength(1);
    expect(result.filtered[0].id).toBe(1);
  });

  it('should compare string "true" when valueType is string', async () => {
    const settings = {
      array: [
        { id: 1, status: 'true' },
        { id: 2, status: 'false' },
        { id: 3, status: true },
      ],
      field: 'status',
      operator: '===',
      value: 'true',
      valueType: 'string',
    };

    const result = await step.run(ctx, settings);

    expect(result.filtered).toHaveLength(1);
    expect(result.filtered[0].id).toBe(1);
  });
});
