import { Injectable } from '@nestjs/common';
import { IContext, IStep } from 'src/types';
import { createStepLog } from 'src/utils/logger';

@Injectable()
export class SendSmsStep implements IStep {
  id: '123';
  type = 'send_sms';
  static stepType = 'send_sms';

  async run(ctx: IContext, settings: any): Promise<any> {
    const msg = settings.message.replace(
      '{{steps.fetchTodo.title}}',
      ctx.steps['fetchTodo']?.title || '',
    );

    const phoneNumber = ctx.vars.phoneNumber || 'unknown';

    ctx.logs.push(
      createStepLog(
        'INFO',
        SendSmsStep.name,
        `Sending SMS to ${phoneNumber} with message: ${msg}`,
      ),
    );

    return { sent: true, message: msg, to: phoneNumber };
  }
}
