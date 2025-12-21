import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';

@Injectable()
export class StringFormatStep implements IStepExecutor {
  static stepType = 'string_format';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { text, operation = 'trim' } = settings;

    ctx.logs.push(
      createStepLog(
        'INFO',
        StringFormatStep.name,
        `Formatting string with ${operation}`,
      ),
    );

    let formatted: string;

    switch (operation) {
      case 'uppercase':
        formatted = text.toUpperCase();
        break;
      case 'lowercase':
        formatted = text.toLowerCase();
        break;
      case 'capitalize':
        formatted = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        break;
      case 'trim':
        formatted = text.trim();
        break;
      default:
        formatted = text;
    }

    return { formatted, original: text };
  }
}
