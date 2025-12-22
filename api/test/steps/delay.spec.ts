import { DelayStep } from '../../src/steps/utilities/delay/delay.service';
import { IContext } from '../../src/types';

describe('DelayStep', () => {
  let step: DelayStep;
  let ctx: IContext;

  beforeEach(() => {
    step = new DelayStep();
    ctx = {
      id: '123',
      name: 'Test',
      vars: {},
      steps: {},
      logs: [],
      status: 'running',
      startedAt: new Date(),
    };
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should delay for specified milliseconds', async () => {
    const settings = { milliseconds: 2000 };

    const promise = step.run(ctx, settings);
    jest.advanceTimersByTime(2000);

    const result = await promise;

    expect(result.delayed).toBe(2000);
  });

  it('should use 1000ms by default', async () => {
    const settings = {};

    const promise = step.run(ctx, settings);
    jest.advanceTimersByTime(1000);

    const result = await promise;

    expect(result.delayed).toBe(1000);
  });

  it('should add log entry with delay duration', async () => {
    const settings = { milliseconds: 500 };

    const promise = step.run(ctx, settings);
    jest.advanceTimersByTime(500);

    await promise;

    expect(ctx.logs).toHaveLength(1);
    expect(ctx.logs[0]).toContain('Delaying for 500ms');
  });
});
