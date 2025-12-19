import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from 'src/types';
import { createStepLog } from 'src/utils';

@Injectable()
export class JsonMinifierStep implements IStepExecutor {
  static stepType = 'json_minifier';

  async run(ctx: IContext, settings: any): Promise<any> {
    const jsonString = settings.jsonString.replace(
      '{{steps.fetchTodo}}',
      JSON.stringify(ctx.steps['fetchTodo'] || {}),
    );
    console.log({ jsonString, type: typeof jsonString });
    let parsedJson: unknown;

    try {
      parsedJson = JSON.parse(jsonString);

      if (parsedJson?.['_metadata']) delete parsedJson['_metadata'];

      const minifiedJsonString = JSON.stringify(parsedJson);

      ctx.logs.push(
        createStepLog(
          'INFO',
          JsonMinifierStep.name,
          'JSON string minified successfully.',
        ),
      );

      return { minifiedJson: minifiedJsonString };
    } catch (error) {
      ctx.logs.push(
        createStepLog(
          'ERROR',
          JsonMinifierStep.name,
          `Invalid JSON string provided: ${error.message}`,
        ),
      );
    }
  }
}
