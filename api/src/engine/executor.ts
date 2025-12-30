import { createStepLog } from '../utils/logger';
import { resolveTemplates } from '../utils/template-resolver';
import { generateUUID } from '../utils/uuid';
import { IStepRegistry, IContext, IFlow, IExecutor } from '../types';
import { SecretsService } from '../services/secrets.service';

export class Executor implements IExecutor {
  constructor(
    private readonly registry: IStepRegistry,
    private readonly secretsService?: SecretsService,
  ) {}

  async run(flow: IFlow, vars: Record<string, any>): Promise<IContext> {
    const ctx: IContext = {
      name: flow.name,
      id: generateUUID(),
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
      await this.executeSteps(ctx, flow.steps, flow.edges || []);

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

  private async executeSteps(
    ctx: IContext,
    steps: any[],
    edges: any[],
  ): Promise<void> {
    const executed = new Set<string>();
    const skipped = new Set<string>();

    // Helper function to mark all descendants as skipped
    const markDescendantsAsSkipped = (stepId: string) => {
      const descendants = edges
        .filter((e) => e.source === stepId)
        .map((e) => e.target);

      for (const descendantId of descendants) {
        if (!executed.has(descendantId) && !skipped.has(descendantId)) {
          skipped.add(descendantId);
          markDescendantsAsSkipped(descendantId); // Recursively skip
        }
      }
    };

    for (const step of steps) {
      // Skip if already executed or marked as skipped
      if (executed.has(step.id) || skipped.has(step.id)) {
        continue;
      }

      // Check if step is connected (has incoming edge or is first step)
      const hasIncomingEdge = edges.some((e) => e.target === step.id);
      const isFirstStep = steps[0]?.id === step.id;

      if (!hasIncomingEdge && !isFirstStep) {
        ctx.logs.push(
          createStepLog(
            'WARN',
            'Executor',
            `Skipping disconnected step: ${step.type} with id: ${step.id}`,
          ),
        );
        skipped.add(step.id);
        continue;
      }

      // Check if this step should be skipped based on conditional branches
      const incomingEdge = edges.find((e) => e.target === step.id);
      if (incomingEdge?.branch) {
        const sourceStep = steps.find((s) => s.id === incomingEdge.source);
        if (sourceStep && executed.has(sourceStep.id)) {
          const sourceResult = ctx.steps[sourceStep.name];
          if (sourceResult?.branch !== incomingEdge.branch) {
            skipped.add(step.id);
            markDescendantsAsSkipped(step.id); // Skip all descendants
            continue;
          }
        }
      }

      ctx.logs.push(
        createStepLog(
          'INFO',
          'Executor',
          `Executing step: ${step.type} with id: ${step.id}`,
        ),
      );

      const output = await this.executeStepWithRetry(ctx, step);

      if (step.name) {
        const metadata = {
          stepId: step.id,
          stepType: step.type,
          success: true,
          executedAt: new Date(),
        };

        if (Array.isArray(output)) {
          ctx.steps[step.name] = output;
          ctx.steps[step.name]._metadata = metadata;
        } else if (typeof output === 'object' && output !== null) {
          ctx.steps[step.name] = {
            ...output,
            _metadata: metadata,
          };
        } else {
          ctx.steps[step.name] = {
            value: output,
            _metadata: metadata,
          };
        }
      }

      executed.add(step.id);

      ctx.logs.push(
        createStepLog(
          'INFO',
          'Executor',
          `Completed step: ${step.type} with id: ${step.id}`,
        ),
      );
    }
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

        let resolvedSettings = resolveTemplates(step.settings || {}, ctx);

        // Resolve secrets if service is available
        if (this.secretsService) {
          resolvedSettings =
            await this.secretsService.resolveSecretsInObject(resolvedSettings);
        }

        return await instance.run(ctx, resolvedSettings);
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
