import { Injectable } from '@nestjs/common';
import { IContext, IStep } from 'src/types';
import { createStepLog } from 'src/utils/logger';

@Injectable()
export class SendSmsStepService implements IStep {
  id: '123';
  type = 'send_sms';
  static stepType = 'send_sms'; // Agregar esto

  async run(ctx: IContext, settings: any): Promise<void> {
    const msg = settings.message.replace(
      '{{http_response.title}}',
      ctx.vars['http_response']?.title || '',
    );

    ctx.logs.push(
      createStepLog(
        'INFO',
        SendSmsStepService.name,
        `Sending SMS with message: ${msg}`,
      ),
    );
  }
}
