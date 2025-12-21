import { SendSmsStep } from '../../src/steps/notifications/send-sms/send-sms.service';
import { IContext } from '../../src/types';

describe('SendSmsStep', () => {
  let step: SendSmsStep;
  let ctx: IContext;

  beforeEach(() => {
    step = new SendSmsStep();
    ctx = {
      id: '123',
      name: 'Test',
      vars: { phoneNumber: '+1234567890' },
      steps: {},
      logs: [],
      status: 'running',
      startedAt: new Date(),
    };
  });

  it('should send SMS with message', async () => {
    const settings = { message: 'Hello from Streamly!' };

    const result = await step.run(ctx, settings);

    expect(result.sent).toBe(true);
    expect(result.message).toBe('Hello from Streamly!');
    expect(result.to).toBe('+1234567890');
  });

  it('should use phone number from context vars', async () => {
    ctx.vars.phoneNumber = '+57 300 123 4567';
    const settings = { message: 'Test message' };

    const result = await step.run(ctx, settings);

    expect(result.to).toBe('+57 300 123 4567');
  });

  it('should add log entry with phone and message', async () => {
    const settings = { message: 'Test SMS' };

    await step.run(ctx, settings);

    expect(ctx.logs).toHaveLength(1);
    expect(ctx.logs[0]).toContain('SMS to +1234567890');
    expect(ctx.logs[0]).toContain('Test SMS');
  });
});
