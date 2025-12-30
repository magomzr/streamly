import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';

@Injectable()
export class DelayStep implements IStepExecutor {
  static readonly stepType = 'delay';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { milliseconds = 1000 } = settings;

    ctx.logs.push(
      createStepLog('INFO', DelayStep.name, `Delaying for ${milliseconds}ms`),
    );

    await new Promise((resolve) => setTimeout(resolve, milliseconds));

    return { delayed: milliseconds };
  }
}
