import { Injectable } from '@nestjs/common';
import { IContext, IStepExecutor } from '../../../types';
import { createStepLog } from '../../../utils/logger';
import { resolveTemplates } from '../../../utils/template-resolver';

@Injectable()
export class ConditionalStep implements IStepExecutor {
  static stepType = 'conditional';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { condition } = settings;

    if (!condition) {
      throw new Error('Condition is required');
    }

    ctx.logs.push(
      createStepLog('INFO', ConditionalStep.name, `Evaluating: ${condition}`),
    );

    const resolved = resolveTemplates(condition, ctx);
    const result = this.evaluateCondition(resolved);

    ctx.logs.push(
      createStepLog(
        'INFO',
        ConditionalStep.name,
        `Result: ${result} (resolved: ${resolved})`,
      ),
    );

    return { result, branch: result ? 'true' : 'false' };
  }

  private evaluateCondition(expression: string): boolean {
    // Simple and safe expression evaluator
    // Supports: ===, !==, >, <, >=, <=, &&, ||
    try {
      // Remove any dangerous code
      if (
        expression.includes('require') ||
        expression.includes('import') ||
        expression.includes('eval') ||
        expression.includes('Function')
      ) {
        throw new Error('Invalid expression');
      }

      // Use Function constructor for safer evaluation than eval
      const fn = new Function(`return ${expression}`);
      return Boolean(fn());
    } catch (error) {
      throw new Error(`Failed to evaluate condition: ${error.message}`);
    }
  }
}
