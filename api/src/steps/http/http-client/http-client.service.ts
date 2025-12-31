import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';

@Injectable()
export class HttpClientStep implements IStepExecutor {
  static readonly stepType = 'http_request';

  async run(ctx: IContext, settings: any): Promise<any> {
    const {
      url,
      method = 'GET',
      headers,
      bearerToken,
      body,
      timeout = 30000,
    } = settings;

    const fetchOptions: RequestInit = { method };

    const finalHeaders: Record<string, string> = {};

    if (headers) {
      const parsedHeaders =
        typeof headers === 'string' ? JSON.parse(headers) : headers;
      Object.assign(finalHeaders, parsedHeaders);
    }

    if (bearerToken) {
      finalHeaders['Authorization'] = `Bearer ${bearerToken}`;
    }

    if (Object.keys(finalHeaders).length > 0) {
      fetchOptions.headers = finalHeaders;
    }

    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      fetchOptions.body =
        typeof body === 'string' ? body : JSON.stringify(body);
      if (!finalHeaders['Content-Type']) {
        finalHeaders['Content-Type'] = 'application/json';
        fetchOptions.headers = finalHeaders;
      }
    }

    const controller = new AbortController();
    fetchOptions.signal = controller.signal;
    setTimeout(() => controller.abort(), timeout);

    ctx.logs.push(
      createStepLog('INFO', HttpClientStep.name, `${method} request to ${url}`),
    );

    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const contentType = res.headers.get('content-type');
    const data = contentType?.includes('application/json')
      ? await res.json()
      : await res.text();

    return {
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      data,
    };
  }
}
