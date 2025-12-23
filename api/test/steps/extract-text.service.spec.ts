import { ExtractTextStep } from '../../src/steps/web-scraping/extract-text/extract-text.service';
import { IContext } from '../../src/types';

describe('ExtractTextStep', () => {
  let step: ExtractTextStep;
  let ctx: IContext;

  beforeEach(() => {
    step = new ExtractTextStep();
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

  it('should extract text from HTML', async () => {
    const html = '<body><div>Hello World</div></body>';
    const result = await step.run(ctx, { html });

    expect(result.text).toBe('Hello World');
    expect(result.length).toBe(11);
  });

  it('should remove script tags', async () => {
    const html =
      '<body><script>alert("test")</script><div>Content</div></body>';
    const result = await step.run(ctx, { html });

    expect(result.text).toBe('Content');
    expect(result.text).not.toContain('alert');
  });

  it('should remove style tags', async () => {
    const html =
      '<body><style>.class { color: red; }</style><div>Text</div></body>';
    const result = await step.run(ctx, { html });

    expect(result.text).toBe('Text');
    expect(result.text).not.toContain('color');
  });

  it('should normalize whitespace', async () => {
    const html = '<body><div>Hello    \n\n   World</div></body>';
    const result = await step.run(ctx, { html });

    expect(result.text).toBe('Hello World');
  });

  it('should handle empty HTML', async () => {
    const html = '<body></body>';
    const result = await step.run(ctx, { html });

    expect(result.text).toBe('');
    expect(result.length).toBe(0);
  });

  it('should throw error when HTML is missing', async () => {
    await expect(step.run(ctx, {})).rejects.toThrow('HTML is required');
  });
});
