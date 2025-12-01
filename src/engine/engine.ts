import { IStepRegistry, IContext, IFlow } from 'src/types';
import { Executor } from './executor';

export class Engine {
  private executor: Executor;

  constructor(private registry: IStepRegistry) {
    this.executor = new Executor(registry);
  }

  async execute(flow: IFlow, vars: any): Promise<IContext> {
    return this.executor.run(flow, vars);
  }
}
