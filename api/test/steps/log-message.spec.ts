import { LogMessageStep } from '../../src/steps/utilities/log-message/log-message.service';
import { IContext } from '../../src/types';

describe('LogMessageStep', () => {
  let step: LogMessageStep;
  let ctx: IContext;

  beforeEach(() => {
    step = new LogMessageStep();
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

  it('should log message with INFO level by default', async () => {
    const settings = { message: 'Test log message' };

    const result = await step.run(ctx, settings);

    expect(result.logged).toBe(true);
    expect(result.message).toBe('Test log message');
    expect(result.level).toBe('INFO');
    expect(ctx.logs).toHaveLength(1);
    expect(ctx.logs[0]).toContain('Test log message');
  });

  it('should log message with custom level', async () => {
    const settings = { message: 'Warning message', level: 'WARN' };

    const result = await step.run(ctx, settings);

    expect(result.level).toBe('WARN');
    expect(ctx.logs[0]).toContain('WARN');
  });

  it('should log ERROR level messages', async () => {
    const settings = { message: 'Error occurred', level: 'ERROR' };

    const result = await step.run(ctx, settings);

    expect(result.level).toBe('ERROR');
    expect(ctx.logs[0]).toContain('ERROR');
  });

  it('should support template variables in message', async () => {
    const settings = { message: 'User ID: {{vars.userId}}' };

    const result = await step.run(ctx, settings);

    expect(result.message).toBe('User ID: {{vars.userId}}');
  });
});
