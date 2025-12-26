import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';

@Injectable()
export class ExtractTextStep implements IStepExecutor {
  static readonly stepType = 'extract_text';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { html } = settings;

    if (!html) {
      throw new Error('HTML is required');
    }

    ctx.logs.push(
      createStepLog('INFO', ExtractTextStep.name, 'Extracting text from HTML'),
    );

    const $ = cheerio.load(html);

    // Remove script and style tags
    $('script, style').remove();

    const text = $('body').text().trim().replace(/\s+/g, ' ');

    ctx.logs.push(
      createStepLog(
        'INFO',
        ExtractTextStep.name,
        `Extracted ${text.length} characters`,
      ),
    );

    return { text, length: text.length };
  }
}
