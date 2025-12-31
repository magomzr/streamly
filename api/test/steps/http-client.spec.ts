import { HttpClientStep } from '../../src/steps/http/http-client/http-client.service';
import { IContext } from '../../src/types';

describe('HttpClientStep', () => {
  let step: HttpClientStep;
  let ctx: IContext;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    step = new HttpClientStep();
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

  it('should make GET request by default', async () => {
    const mockData = { id: 1, title: 'Test' };
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockData,
      headers: new Headers({ 'content-type': 'application/json' }),
    } as Response);

    const settings = { url: 'https://api.example.com/data' };

    const result = await step.run(ctx, settings);

    expect(result.status).toBe(200);
    expect(result.data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/data',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('should make POST request with body', async () => {
    const mockData = { success: true };
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockData,
      headers: new Headers({ 'content-type': 'application/json' }),
    } as Response);

    const settings = {
      url: 'https://api.example.com/data',
      method: 'POST',
      body: { name: 'Test' },
    };

    const result = await step.run(ctx, settings);

    expect(result.status).toBe(200);
    expect(result.data).toEqual(mockData);
  });

  it('should add custom headers', async () => {
    const mockData = { data: 'test' };
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockData,
      headers: new Headers({ 'content-type': 'application/json' }),
    } as Response);

    const settings = {
      url: 'https://api.example.com/data',
      method: 'GET',
      headers: { 'X-Custom-Header': 'value' },
    };

    await step.run(ctx, settings);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/data',
      expect.objectContaining({
        method: 'GET',
        headers: { 'X-Custom-Header': 'value' },
      }),
    );
  });

  it('should parse headers from JSON string', async () => {
    const mockData = { data: 'test' };
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockData,
      headers: new Headers({ 'content-type': 'application/json' }),
    } as Response);

    const settings = {
      url: 'https://api.example.com/data',
      method: 'GET',
      headers: '{"X-Custom-Header": "value"}',
    };

    await step.run(ctx, settings);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/data',
      expect.objectContaining({
        method: 'GET',
        headers: { 'X-Custom-Header': 'value' },
      }),
    );
  });

  it('should add Bearer token to Authorization header', async () => {
    const mockData = { authenticated: true };
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockData,
      headers: new Headers({ 'content-type': 'application/json' }),
    } as Response);

    const settings = {
      url: 'https://api.example.com/secure',
      method: 'GET',
      bearerToken: 'my-secret-token',
    };

    await step.run(ctx, settings);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/secure',
      expect.objectContaining({
        method: 'GET',
        headers: { Authorization: 'Bearer my-secret-token' },
      }),
    );
  });

  it('should combine custom headers with Bearer token', async () => {
    const mockData = { data: 'secure' };
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockData,
      headers: new Headers({ 'content-type': 'application/json' }),
    } as Response);

    const settings = {
      url: 'https://api.example.com/data',
      method: 'GET',
      headers: { 'X-Custom': 'value' },
      bearerToken: 'token123',
    };

    await step.run(ctx, settings);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/data',
      expect.objectContaining({
        method: 'GET',
        headers: {
          'X-Custom': 'value',
          Authorization: 'Bearer token123',
        },
      }),
    );
  });

  it('should handle PUT request with body', async () => {
    const mockData = { updated: true };
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockData,
      headers: new Headers({ 'content-type': 'application/json' }),
    } as Response);

    const settings = {
      url: 'https://api.example.com/data/1',
      method: 'PUT',
      body: { name: 'Updated' },
    };

    await step.run(ctx, settings);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/data/1',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated' }),
      }),
    );
  });

  it('should handle PATCH request with body', async () => {
    const mockData = { patched: true };
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockData,
      headers: new Headers({ 'content-type': 'application/json' }),
    } as Response);

    const settings = {
      url: 'https://api.example.com/data/1',
      method: 'PATCH',
      body: { status: 'active' },
    };

    await step.run(ctx, settings);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/data/1',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ status: 'active' }),
      }),
    );
  });

  it('should not add body for GET requests', async () => {
    const mockData = { data: 'test' };
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockData,
      headers: new Headers({ 'content-type': 'application/json' }),
    } as Response);

    const settings = {
      url: 'https://api.example.com/data',
      method: 'GET',
      body: { ignored: true },
    };

    await step.run(ctx, settings);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/data',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(fetchMock.mock.calls[0][1]).not.toHaveProperty('body');
  });

  it('should handle string body', async () => {
    const mockData = { received: true };
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockData,
      headers: new Headers({ 'content-type': 'application/json' }),
    } as Response);

    const settings = {
      url: 'https://api.example.com/data',
      method: 'POST',
      body: '{"raw": "json"}',
    };

    await step.run(ctx, settings);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/data',
      expect.objectContaining({
        method: 'POST',
        body: '{"raw": "json"}',
      }),
    );
  });

  it('should return text for non-JSON responses', async () => {
    const mockText = '<html>Test</html>';
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => mockText,
      headers: new Headers({ 'content-type': 'text/html' }),
    } as Response);

    const settings = {
      url: 'https://example.com/page',
      method: 'GET',
    };

    const result = await step.run(ctx, settings);

    expect(result.status).toBe(200);
    expect(result.data).toBe(mockText);
  });

  it('should add log entry with method and URL', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({}),
      headers: new Headers({ 'content-type': 'application/json' }),
    } as Response);

    const settings = {
      url: 'https://api.example.com/test',
      method: 'POST',
    };

    await step.run(ctx, settings);

    expect(ctx.logs).toHaveLength(1);
    expect(ctx.logs[0]).toContain(
      'POST request to https://api.example.com/test',
    );
  });

  it('should handle HTTP error status codes', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers(),
    } as Response);

    const settings = {
      url: 'https://api.example.com/notfound',
      method: 'GET',
    };

    await expect(step.run(ctx, settings)).rejects.toThrow(
      'HTTP 404: Not Found',
    );
  });

  it('should handle timeout', async () => {
    fetchMock.mockRejectedValue({ name: 'AbortError' });

    const settings = {
      url: 'https://api.example.com/slow',
      method: 'GET',
      timeout: 100,
    };

    await expect(step.run(ctx, settings)).rejects.toEqual({
      name: 'AbortError',
    });
  });

  it('should return response headers', async () => {
    const mockData = { data: 'test' };
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockData,
      headers: new Headers({
        'content-type': 'application/json',
        'x-custom': 'value',
      }),
    } as Response);

    const settings = {
      url: 'https://api.example.com/data',
      method: 'GET',
    };

    const result = await step.run(ctx, settings);

    expect(result.headers).toHaveProperty('content-type', 'application/json');
    expect(result.headers).toHaveProperty('x-custom', 'value');
  });
});
