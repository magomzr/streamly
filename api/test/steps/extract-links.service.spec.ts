import { ExtractLinksStep } from '../../src/steps/web-scraping/extract-links/extract-links.service';
import { IContext } from '../../src/types';

describe('ExtractLinksStep', () => {
  let step: ExtractLinksStep;
  let ctx: IContext;

  beforeEach(() => {
    step = new ExtractLinksStep();
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

  it('should extract all links from HTML', async () => {
    const html = '<a href="/page1">Link 1</a><a href="/page2">Link 2</a>';
    const result = await step.run(ctx, { html });

    expect(result.links).toEqual(['/page1', '/page2']);
    expect(result.count).toBe(2);
  });

  it('should convert relative links to absolute with baseUrl', async () => {
    const html = '<a href="/page1">Link 1</a><a href="/page2">Link 2</a>';
    const result = await step.run(ctx, {
      html,
      baseUrl: 'https://example.com',
    });

    expect(result.links).toEqual([
      'https://example.com/page1',
      'https://example.com/page2',
    ]);
    expect(result.count).toBe(2);
  });

  it('should return unique links only', async () => {
    const html =
      '<a href="/page1">Link 1</a><a href="/page1">Link 1 again</a><a href="/page2">Link 2</a>';
    const result = await step.run(ctx, { html });

    expect(result.links).toEqual(['/page1', '/page2']);
    expect(result.count).toBe(2);
  });

  it('should handle absolute URLs', async () => {
    const html = '<a href="https://example.com/page">Link</a>';
    const result = await step.run(ctx, { html });

    expect(result.links).toEqual(['https://example.com/page']);
    expect(result.count).toBe(1);
  });

  it('should return empty array when no links found', async () => {
    const html = '<div>No links here</div>';
    const result = await step.run(ctx, { html });

    expect(result.links).toEqual([]);
    expect(result.count).toBe(0);
  });

  it('should throw error when HTML is missing', async () => {
    await expect(step.run(ctx, {})).rejects.toThrow('HTML is required');
  });
});
