import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';

@Injectable()
export class Base64DecodeStep implements IStepExecutor {
  static readonly stepType = 'base64_decode';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { encoded } = settings;

    ctx.logs.push(
      createStepLog('INFO', Base64DecodeStep.name, 'Decoding from base64'),
    );

    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');

    return { decoded, original: encoded };
  }
}
