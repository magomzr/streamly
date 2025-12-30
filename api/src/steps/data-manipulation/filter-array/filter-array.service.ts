import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';

@Injectable()
export class FilterArrayStep implements IStepExecutor {
  static readonly stepType = 'filter_array';

  async run(ctx: IContext, settings: any): Promise<any> {
    const {
      array,
      field,
      operator = '===',
      value,
      valueType = 'string',
    } = settings;

    ctx.logs.push(
      createStepLog(
        'INFO',
        FilterArrayStep.name,
        `Filtering array by ${field} ${operator} ${value} (${valueType})`,
      ),
    );

    // Parse value based on valueType
    const parseValue = (val: any, type: string) => {
      switch (type) {
        case 'boolean':
          return val === 'true' || val === true;
        case 'number':
          return Number(val);
        case 'null':
          return null;
        case 'string':
        default:
          return String(val);
      }
    };

    const parsedValue = parseValue(value, valueType);

    const filtered = array.filter((item: any) => {
      const fieldValue = item[field];
      switch (operator) {
        case '===':
          return fieldValue === parsedValue;
        case '!==':
          return fieldValue !== parsedValue;
        case '>':
          return fieldValue > (parsedValue ?? 0);
        case '<':
          return fieldValue < (parsedValue ?? 0);
        case '>=':
          return fieldValue >= (parsedValue ?? 0);
        case '<=':
          return fieldValue <= (parsedValue ?? 0);
        case 'contains':
          if (typeof fieldValue === 'string') {
            return fieldValue.includes(String(parsedValue));
          }
          if (Array.isArray(fieldValue)) {
            return fieldValue.includes(parsedValue);
          }
          return false;
        default:
          return true;
      }
    });

    return { filtered, count: filtered.length };
  }
}
