import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';

@Injectable()
export class TransformDataStep implements IStepExecutor {
  static stepType = 'transform_data';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { mapping } = settings;

    ctx.logs.push(
      createStepLog('INFO', TransformDataStep.name, 'Transforming data'),
    );

    return mapping;
  }
}
