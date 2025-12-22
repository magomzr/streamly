import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';

@Injectable()
export class WebhookStep implements IStepExecutor {
  static stepType = 'webhook';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { url, payload = {}, headers = {} } = settings;

    ctx.logs.push(createStepLog('INFO', WebhookStep.name, `POST to ${url}`));

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    return { status: res.status, data };
  }
}
