import { HtmlParserStep } from '../../src/steps/web-scraping/html-parser/html-parser.service';
import { IContext } from '../../src/types';

describe('HtmlParserStep', () => {
  let step: HtmlParserStep;
  let ctx: IContext;

  beforeEach(() => {
    step = new HtmlParserStep();
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

  it('should extract text from HTML elements', async () => {
    const html =
      '<div class="title">Product 1</div><div class="title">Product 2</div>';
    const result = await step.run(ctx, { html, selector: '.title' });

    expect(result.elements).toEqual(['Product 1', 'Product 2']);
    expect(result.count).toBe(2);
  });

  it('should extract attributes from HTML elements', async () => {
    const html = '<a href="/page1">Link 1</a><a href="/page2">Link 2</a>';
    const result = await step.run(ctx, {
      html,
      selector: 'a',
      attribute: 'href',
    });

    expect(result.elements).toEqual(['/page1', '/page2']);
    expect(result.count).toBe(2);
  });

  it('should return empty array when no elements found', async () => {
    const html = '<div>No matching elements</div>';
    const result = await step.run(ctx, { html, selector: '.nonexistent' });

    expect(result.elements).toEqual([]);
    expect(result.count).toBe(0);
  });

  it('should filter out empty results', async () => {
    const html = '<div class="item">Text</div><div class="item"></div>';
    const result = await step.run(ctx, { html, selector: '.item' });

    expect(result.elements).toEqual(['Text']);
    expect(result.count).toBe(1);
  });

  it('should throw error when HTML is missing', async () => {
    await expect(step.run(ctx, { selector: '.title' })).rejects.toThrow(
      'HTML and selector are required',
    );
  });

  it('should throw error when selector is missing', async () => {
    await expect(step.run(ctx, { html: '<div>Test</div>' })).rejects.toThrow(
      'HTML and selector are required',
    );
  });
});
