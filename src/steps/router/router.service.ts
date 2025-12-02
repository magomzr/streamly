import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from '../../types';
import { createStepLog } from '../../utils/logger';

@Injectable()
export class RouterStep implements IStepExecutor {
  static stepType = 'router';

  async run(ctx: IContext, settings: any): Promise<any> {
    ctx.logs.push(createStepLog('INFO', 'RouterStep', 'Evaluating branches'));

    return { routerExecuted: true };
  }
}
