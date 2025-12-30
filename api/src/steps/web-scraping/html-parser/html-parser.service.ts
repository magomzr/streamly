import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';

@Injectable()
export class HtmlParserStep implements IStepExecutor {
  static readonly stepType = 'html_parser';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { html, selector, attribute } = settings;

    if (!html || !selector) {
      throw new Error('HTML and selector are required');
    }

    ctx.logs.push(
      createStepLog(
        'INFO',
        HtmlParserStep.name,
        `Parsing HTML with selector: ${selector}`,
      ),
    );

    const $ = cheerio.load(html);
    const elements = $(selector);

    if (elements.length === 0) {
      ctx.logs.push(
        createStepLog('WARN', HtmlParserStep.name, 'No elements found'),
      );
      return { elements: [], count: 0 };
    }

    const results = elements
      .map((_, el) => {
        if (attribute) {
          return $(el).attr(attribute);
        }
        return $(el).text().trim();
      })
      .get()
      .filter(Boolean);

    ctx.logs.push(
      createStepLog(
        'INFO',
        HtmlParserStep.name,
        `Found ${results.length} elements`,
      ),
    );

    return { elements: results, count: results.length };
  }
}
