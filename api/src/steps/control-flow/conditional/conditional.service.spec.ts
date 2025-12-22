import { ConditionalStep } from './conditional.service';
import { IContext } from '../../../types';

describe('ConditionalStep', () => {
  let step: ConditionalStep;
  let ctx: IContext;

  beforeEach(() => {
    step = new ConditionalStep();
    ctx = {
      id: 'test-id',
      name: 'test-flow',
      vars: {},
      steps: {},
      logs: [],
      status: 'running',
      startedAt: new Date(),
    };
  });

  it('should evaluate true condition', async () => {
    const result = await step.run(ctx, { condition: '5 > 3' });
    expect(result.result).toBe(true);
    expect(result.branch).toBe('true');
  });

  it('should evaluate false condition', async () => {
    const result = await step.run(ctx, { condition: '5 < 3' });
    expect(result.result).toBe(false);
    expect(result.branch).toBe('false');
  });

  it('should evaluate equality', async () => {
    const result = await step.run(ctx, { condition: '"active" === "active"' });
    expect(result.result).toBe(true);
    expect(result.branch).toBe('true');
  });

  it('should evaluate inequality', async () => {
    const result = await step.run(ctx, {
      condition: '"active" !== "inactive"',
    });
    expect(result.result).toBe(true);
    expect(result.branch).toBe('true');
  });

  it('should resolve templates before evaluation', async () => {
    ctx.steps = { fetchUser: { status: 'active' } };
    const result = await step.run(ctx, {
      condition: '"{{steps.fetchUser.status}}" === "active"',
    });
    expect(result.result).toBe(true);
    expect(result.branch).toBe('true');
  });

  it('should handle complex conditions with &&', async () => {
    const result = await step.run(ctx, { condition: '5 > 3 && 10 < 20' });
    expect(result.result).toBe(true);
  });

  it('should handle complex conditions with ||', async () => {
    const result = await step.run(ctx, { condition: '5 < 3 || 10 < 20' });
    expect(result.result).toBe(true);
  });

  it('should throw error for missing condition', async () => {
    await expect(step.run(ctx, {})).rejects.toThrow('Condition is required');
  });

  it('should throw error for dangerous expressions', async () => {
    await expect(
      step.run(ctx, { condition: 'require("fs")' }),
    ).rejects.toThrow();
  });
});
