import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';

@Injectable()
export class ExtractLinksStep implements IStepExecutor {
  static readonly stepType = 'extract_links';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { html, baseUrl } = settings;

    if (!html) {
      throw new Error('HTML is required');
    }

    ctx.logs.push(
      createStepLog(
        'INFO',
        ExtractLinksStep.name,
        'Extracting links from HTML',
      ),
    );

    const $ = cheerio.load(html);
    const links = $('a[href]')
      .map((_, el) => {
        let href = $(el).attr('href');
        if (href && baseUrl) {
          try {
            href = new URL(href, baseUrl).href;
          } catch (e) {
            // Invalid URL, keep original
          }
        }
        return href;
      })
      .get()
      .filter(Boolean);

    const uniqueLinks = [...new Set(links)];

    ctx.logs.push(
      createStepLog(
        'INFO',
        ExtractLinksStep.name,
        `Found ${uniqueLinks.length} unique links`,
      ),
    );

    return { links: uniqueLinks, count: uniqueLinks.length };
  }
}
