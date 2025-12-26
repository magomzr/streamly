import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';

@Injectable()
export class Base64EncodeStep implements IStepExecutor {
  static readonly stepType = 'base64_encode';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { text } = settings;

    ctx.logs.push(
      createStepLog('INFO', Base64EncodeStep.name, 'Encoding to base64'),
    );

    const encoded = Buffer.from(text).toString('base64');

    return { encoded, original: text };
  }
}
