import { Base64DecodeStep } from '../../src/steps/encoding/base64-decode/base64-decode.service';
import { IContext } from '../../src/types';

describe('Base64DecodeStep', () => {
  let step: Base64DecodeStep;
  let ctx: IContext;

  beforeEach(() => {
    step = new Base64DecodeStep();
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

  it('should decode base64 to text', async () => {
    const settings = { encoded: 'SGVsbG8gV29ybGQ=' };

    const result = await step.run(ctx, settings);

    expect(result.decoded).toBe('Hello World');
    expect(result.original).toBe('SGVsbG8gV29ybGQ=');
  });

  it('should decode special characters', async () => {
    const settings = { encoded: 'SGVsbG8g5LiW55WMISDwn4yN' };

    const result = await step.run(ctx, settings);

    expect(result.decoded).toBe('Hello 世界! 🌍');
  });

  it('should decode empty string', async () => {
    const settings = { encoded: '' };

    const result = await step.run(ctx, settings);

    expect(result.decoded).toBe('');
  });

  it('should add log entry', async () => {
    const settings = { encoded: 'dGVzdA==' };

    await step.run(ctx, settings);

    expect(ctx.logs).toHaveLength(1);
    expect(ctx.logs[0]).toContain('Decoding from base64');
  });
});
