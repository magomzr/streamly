import { StringFormatStep } from '../../src/steps/encoding/string-format/string-format.service';
import { IContext } from '../../src/types';

describe('StringFormatStep', () => {
  let step: StringFormatStep;
  let ctx: IContext;

  beforeEach(() => {
    step = new StringFormatStep();
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

  it('should trim text by default', async () => {
    const settings = { text: '  Hello World  ' };

    const result = await step.run(ctx, settings);

    expect(result.formatted).toBe('Hello World');
    expect(result.original).toBe('  Hello World  ');
  });

  it('should convert to uppercase', async () => {
    const settings = {
      text: 'hello world',
      operation: 'uppercase',
    };

    const result = await step.run(ctx, settings);

    expect(result.formatted).toBe('HELLO WORLD');
  });

  it('should convert to lowercase', async () => {
    const settings = {
      text: 'HELLO WORLD',
      operation: 'lowercase',
    };

    const result = await step.run(ctx, settings);

    expect(result.formatted).toBe('hello world');
  });

  it('should capitalize text', async () => {
    const settings = {
      text: 'hello world',
      operation: 'capitalize',
    };

    const result = await step.run(ctx, settings);

    expect(result.formatted).toBe('Hello world');
  });

  it('should trim whitespace', async () => {
    const settings = {
      text: '\n  test  \t',
      operation: 'trim',
    };

    const result = await step.run(ctx, settings);

    expect(result.formatted).toBe('test');
  });

  it('should return original text for unknown operation', async () => {
    const settings = {
      text: 'Hello',
      operation: 'unknown',
    };

    const result = await step.run(ctx, settings);

    expect(result.formatted).toBe('Hello');
  });

  it('should add log entry', async () => {
    const settings = {
      text: 'test',
      operation: 'uppercase',
    };

    await step.run(ctx, settings);

    expect(ctx.logs).toHaveLength(1);
    expect(ctx.logs[0]).toContain('Formatting string');
  });
});
