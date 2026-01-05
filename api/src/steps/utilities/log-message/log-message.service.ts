import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';

@Injectable()
export class LogMessageStep implements IStepExecutor {
  static readonly stepType = 'log_message';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { message, level = 'INFO' } = settings;

    ctx.logs.push(createStepLog(level, LogMessageStep.name, message));

    return { logged: true, message, level };
  }
}
