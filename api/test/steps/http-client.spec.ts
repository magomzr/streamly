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
      json: async () => mockData,
    } as Response);

    const settings = { url: 'https://api.example.com/data' };

    const result = await step.run(ctx, settings);

    expect(result).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/data');
  });

  it('should make request with specified method', async () => {
    const mockData = { success: true };
    fetchMock.mockResolvedValue({
      json: async () => mockData,
    } as Response);

    const settings = {
      url: 'https://api.example.com/data',
      method: 'POST',
    };

    const result = await step.run(ctx, settings);

    expect(result).toEqual(mockData);
  });

  it('should add log entry with method and URL', async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({}),
    } as Response);

    const settings = {
      url: 'https://api.example.com/test',
      method: 'GET',
    };

    await step.run(ctx, settings);

    expect(ctx.logs).toHaveLength(1);
    expect(ctx.logs[0]).toContain(
      'GET request to https://api.example.com/test',
    );
  });
});
