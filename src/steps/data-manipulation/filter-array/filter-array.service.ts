import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';

@Injectable()
export class FilterArrayStep implements IStepExecutor {
  static stepType = 'filter_array';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { array, field, operator = '===', value } = settings;

    ctx.logs.push(
      createStepLog(
        'INFO',
        FilterArrayStep.name,
        `Filtering array by ${field} ${operator} ${value}`,
      ),
    );

    const filtered = array.filter((item: any) => {
      const fieldValue = item[field];
      switch (operator) {
        case '===':
          return fieldValue === value;
        case '!==':
          return fieldValue !== value;
        case '>':
          return fieldValue > value;
        case '<':
          return fieldValue < value;
        case '>=':
          return fieldValue >= value;
        case '<=':
          return fieldValue <= value;
        default:
          return true;
      }
    });

    return { filtered, count: filtered.length };
  }
}
