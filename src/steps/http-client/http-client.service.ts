import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from 'src/types';
import { createStepLog } from 'src/utils/logger';

@Injectable()
export class HttpClientStep implements IStepExecutor {
  static stepType = 'http_request';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { url, method = 'GET' } = settings;

    ctx.logs.push(
      createStepLog(
        'INFO',
        HttpClientStep.name,
        `Making ${method} request to ${url}`,
      ),
    );

    const res = await fetch(url);
    const data = await res.json();

    ctx.logs.push(
      createStepLog(
        'INFO',
        HttpClientStep.name,
        `Received response from ${url}`,
      ),
    );

    return data;
  }
}
