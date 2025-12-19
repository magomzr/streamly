import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from 'src/types';
import { createStepLog } from 'src/utils';

@Injectable()
export class JsonMinifierStep implements IStepExecutor {
  static stepType = 'json_minifier';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { jsonString } = settings;

    const parsedJson = JSON.parse(jsonString as string);

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
