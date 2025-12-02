import { createStepLog } from '../utils/logger';
import { evaluateCondition } from '../utils/condition-evaluator';
import { IStepRegistry, IContext, IFlow, IExecutor } from '../types';

export class Executor implements IExecutor {
  constructor(private registry: IStepRegistry) {}

  async run(flow: IFlow, vars: Record<string, any>): Promise<IContext> {
    const ctx: IContext = {
      name: flow.name,
      id: '123',
      vars: { ...vars },
      steps: {},
      logs: [],
      status: 'running',
      startedAt: new Date(),
    };

    ctx.logs.push(
      createStepLog('INFO', 'Executor', `Starting flow: ${flow.name}`),
    );

    try {
      await this.executeSteps(ctx, flow.steps);

      ctx.status = 'completed';
      ctx.completedAt = new Date();
      ctx.logs.push(
        createStepLog(
          'INFO',
          'Executor',
          `Flow ${flow.name} completed successfully.`,
        ),
      );
    } catch (error) {
      ctx.status = 'failed';
      ctx.completedAt = new Date();
      ctx.logs.push(
        createStepLog(
          'ERROR',
          'Executor',
          `Flow ${flow.name} failed: ${error.message}`,
        ),
      );
    }

    return ctx;
  }

  private async executeSteps(ctx: IContext, steps: any[]): Promise<void> {
    for (const step of steps) {
      ctx.logs.push(
        createStepLog(
          'INFO',
          'Executor',
          `Executing step: ${step.type} with id: ${step.id}`,
        ),
      );

      const output = await this.executeStepWithRetry(ctx, step);

      if (step.name) {
        ctx.steps[step.name] = {
          ...output,
          _metadata: {
            stepId: step.id,
            stepType: step.type,
            success: true,
            executedAt: new Date(),
          },
        };
      }

      ctx.logs.push(
        createStepLog(
          'INFO',
          'Executor',
          `Completed step: ${step.type} with id: ${step.id}`,
        ),
      );

      if (step.branches && step.branches.length > 0) {
        await this.executeBranches(ctx, step.branches);
        return;
      }
    }
  }

  private async executeBranches(ctx: IContext, branches: any[]): Promise<void> {
    for (const branch of branches) {
      const conditionMet = evaluateCondition(branch.condition, ctx);

      if (conditionMet) {
        ctx.logs.push(
          createStepLog(
            'INFO',
            'Executor',
            `Branch condition met: ${branch.condition}`,
          ),
        );

        await this.executeSteps(ctx, branch.steps);
        return;
      }
    }

    ctx.logs.push(createStepLog('WARN', 'Executor', 'No branch condition met'));
  }

  private async executeStepWithRetry(ctx: IContext, step: any): Promise<any> {
    const maxAttempts = step.retry?.maxAttempts || 1;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (attempt > 1) {
          ctx.logs.push(
            createStepLog(
              'WARN',
              'Executor',
              `Retrying step ${step.type} (attempt ${attempt}/${maxAttempts})`,
            ),
          );
        }

        const StepCtor = this.registry.resolve(step.type);
        const instance = new StepCtor();
        return await instance.run(ctx, step.settings || {});
      } catch (error) {
        lastError = error;
        ctx.logs.push(
          createStepLog(
            'ERROR',
            'Executor',
            `Step ${step.type} failed on attempt ${attempt}: ${error.message}`,
          ),
        );
      }
    }

    ctx.error = {
      stepId: step.id,
      stepName: step.name,
      message: lastError?.message || 'Unknown error',
      attempt: maxAttempts,
    };

    throw lastError || new Error('Step execution failed');
  }
}
