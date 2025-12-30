import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from 'src/types';
import { createStepLog } from 'src/utils';

@Injectable()
export class JsonMinifierStep implements IStepExecutor {
  static readonly stepType = 'json_minifier';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { jsonString } = settings;

    let parsedJson: any;

    if (typeof jsonString === 'string') {
      parsedJson = JSON.parse(jsonString);
    } else {
      parsedJson = jsonString;
    }

    if (parsedJson?._metadata) {
      delete parsedJson._metadata;
    }

    ctx.logs.push(
      createStepLog(
        'INFO',
        JsonMinifierStep.name,
        'JSON minified successfully',
      ),
    );

    return { minifiedJson: JSON.stringify(parsedJson) };
  }
}
