import { WebhookStep } from '../../src/steps/http/webhook/webhook.service';
import { IContext } from '../../src/types';

describe('WebhookStep', () => {
  let step: WebhookStep;
  let ctx: IContext;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    step = new WebhookStep();
    ctx = {
      id: '123',
      name: 'Test',
      vars: {},
      steps: {},
      logs: [],
      status: 'running',
      startedAt: new Date(),
    };

    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('should send POST request with payload', async () => {
    const mockResponse = { success: true };
    fetchMock.mockResolvedValue({
      status: 200,
      json: async () => mockResponse,
    } as Response);

    const settings = {
      url: 'https://webhook.example.com',
      payload: { message: 'Hello' },
    };

    const result = await step.run(ctx, settings);

    expect(result.status).toBe(200);
    expect(result.data).toEqual(mockResponse);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://webhook.example.com',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello' }),
      }),
    );
  });

  it('should use empty payload by default', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: async () => ({}),
    } as Response);

    const settings = { url: 'https://webhook.example.com' };

    await step.run(ctx, settings);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://webhook.example.com',
      expect.objectContaining({
        body: JSON.stringify({}),
      }),
    );
  });

  it('should merge custom headers', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: async () => ({}),
    } as Response);

    const settings = {
      url: 'https://webhook.example.com',
      headers: { Authorization: 'Bearer token123' },
    };

    await step.run(ctx, settings);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://webhook.example.com',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token123',
        },
      }),
    );
  });

  it('should add log entry', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: async () => ({}),
    } as Response);

    const settings = { url: 'https://webhook.example.com' };

    await step.run(ctx, settings);

    expect(ctx.logs).toHaveLength(1);
    expect(ctx.logs[0]).toContain('POST to https://webhook.example.com');
  });
});
