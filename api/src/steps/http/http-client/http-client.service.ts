import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';

@Injectable()
export class HttpClientStep implements IStepExecutor {
  static readonly stepType = 'http_request';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { url, method = 'GET', headers, bearerToken, body } = settings;

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

    ctx.logs.push(
      createStepLog('INFO', HttpClientStep.name, `${method} request to ${url}`),
    );

    const res = await fetch(url, fetchOptions);
    const contentType = res.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return await res.json();
    }

    return await res.text();
  }
}
