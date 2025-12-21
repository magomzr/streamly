import { JsonMinifierStep } from '../../src/steps/data-manipulation/json-minifer/json-minifier.service';
import { IContext } from '../../src/types';

describe('JsonMinifierStep', () => {
  let step: JsonMinifierStep;
  let ctx: IContext;

  beforeEach(() => {
    step = new JsonMinifierStep();
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

  it('should minify JSON string', async () => {
    const settings = {
      jsonString: '{\n  "name": "John",\n  "age": 30\n}',
    };

    const result = await step.run(ctx, settings);

    expect(result.minifiedJson).toBe('{"name":"John","age":30}');
  });

  it('should handle object input directly', async () => {
    const settings = {
      jsonString: { name: 'Alice', age: 25 },
    };

    const result = await step.run(ctx, settings);

    expect(result.minifiedJson).toBe('{"name":"Alice","age":25}');
  });

  it('should remove _metadata field', async () => {
    const settings = {
      jsonString: {
        name: 'Bob',
        _metadata: { timestamp: '2024-01-01' },
      },
    };

    const result = await step.run(ctx, settings);

    expect(result.minifiedJson).toBe('{"name":"Bob"}');
    expect(result.minifiedJson).not.toContain('_metadata');
  });

  it('should handle arrays', async () => {
    const settings = {
      jsonString: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ],
    };

    const result = await step.run(ctx, settings);

    expect(result.minifiedJson).toBe(
      '[{"id":1,"name":"Item 1"},{"id":2,"name":"Item 2"}]',
    );
  });

  it('should add log entry', async () => {
    const settings = {
      jsonString: '{"test": true}',
    };

    await step.run(ctx, settings);

    expect(ctx.logs).toHaveLength(1);
    expect(ctx.logs[0]).toContain('JSON minified successfully');
  });
});
