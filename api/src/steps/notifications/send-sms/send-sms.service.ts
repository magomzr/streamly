import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';

@Injectable()
export class SendSmsStep implements IStepExecutor {
  static readonly stepType = 'send_sms';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { message } = settings;
    const phoneNumber = ctx.vars.phoneNumber;

    ctx.logs.push(
      createStepLog(
        'INFO',
        SendSmsStep.name,
        `SMS to ${phoneNumber}: ${message}`,
      ),
    );

    return { sent: true, message, to: phoneNumber };
  }
}
