import { Base64EncodeStep } from '../../src/steps/encoding/base64-encode/base64-encode.service';
import { IContext } from '../../src/types';

describe('Base64EncodeStep', () => {
  let step: Base64EncodeStep;
  let ctx: IContext;

  beforeEach(() => {
    step = new Base64EncodeStep();
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

  it('should encode text to base64', async () => {
    const settings = { text: 'Hello World' };

    const result = await step.run(ctx, settings);

    expect(result.encoded).toBe('SGVsbG8gV29ybGQ=');
    expect(result.original).toBe('Hello World');
  });

  it('should encode special characters', async () => {
    const settings = { text: 'Hello 世界! 🌍' };

    const result = await step.run(ctx, settings);

    expect(result.encoded).toBe('SGVsbG8g5LiW55WMISDwn4yN');
  });

  it('should encode empty string', async () => {
    const settings = { text: '' };

    const result = await step.run(ctx, settings);

    expect(result.encoded).toBe('');
  });

  it('should add log entry', async () => {
    const settings = { text: 'test' };

    await step.run(ctx, settings);

    expect(ctx.logs).toHaveLength(1);
    expect(ctx.logs[0]).toContain('Encoding to base64');
  });
});
