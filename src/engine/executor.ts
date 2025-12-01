import { createStepLog } from 'src/utils/logger';
import { IStepRegistry, IContext, IFlow, IExecutor } from 'src/types';

export class Executor implements IExecutor {
  constructor(private registry: IStepRegistry) {}

  async run(flow: IFlow, input: any): Promise<IContext> {
    const ctx: IContext = {
      name: flow.name,
      id: '123',
      vars: { ...input },
      steps: {},
      logs: [],
    };

    ctx.logs.push(
      createStepLog('INFO', 'Executor', `Starting flow: ${flow.name}`),
    );

    for (const step of flow.steps) {
      ctx.logs.push(
        createStepLog('INFO', 'Executor', `Executing step: ${step.type} with id: ${step.id}`),
      );

      const StepCtor = this.registry.resolve(step.type);
      const instance = new StepCtor();

      await instance.run(ctx, step.settings || {});

      ctx.logs.push(
        createStepLog('INFO', 'Executor', `Completed step: ${step.type} with id: ${step.id}`),
      );
    }

    ctx.logs.push(
      createStepLog('INFO', 'Executor', `Flow ${flow.name} completed.`),
    );
    return ctx;
  }
}
