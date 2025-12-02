import { createStepLog } from 'src/utils/logger';
import { IStepRegistry, IContext, IFlow, IExecutor } from 'src/types';

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
      for (const step of flow.steps) {
        ctx.logs.push(
          createStepLog(
            'INFO',
            'Executor',
            `Executing step: ${step.type} with id: ${step.id}`,
          ),
        );

        const output = await this.executeStepWithRetry(ctx, step);

        if (step.name) {
          ctx.steps[step.name] = output;
        }

        ctx.logs.push(
          createStepLog(
            'INFO',
            'Executor',
            `Completed step: ${step.type} with id: ${step.id}`,
          ),
        );
      }

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
