import { IStepRegistry, IContext, IFlow } from '../types';
import { Executor } from './executor';

export class Engine {
  private readonly executor: Executor;

  constructor(private readonly registry: IStepRegistry) {
    this.executor = new Executor(registry);
  }

  async execute(flow: IFlow, vars: Record<string, any>): Promise<IContext> {
    return this.executor.run(flow, vars);
  }
}
