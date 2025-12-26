import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';

@Injectable()
export class SortArrayStep implements IStepExecutor {
  static readonly stepType = 'sort_array';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { array, field, order = 'asc' } = settings;

    ctx.logs.push(
      createStepLog(
        'INFO',
        SortArrayStep.name,
        `Sorting array by ${field} (${order})`,
      ),
    );

    const sorted = [...array].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return { sorted, count: sorted.length };
  }
}
