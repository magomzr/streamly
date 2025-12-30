import { IStepRegistry, IContext, IFlow } from '../types';
import { Executor } from './executor';
import { SecretsService } from '../services/secrets.service';

export class Engine {
  private readonly executor: Executor;

  constructor(
    private readonly registry: IStepRegistry,
    private readonly secretsService?: SecretsService,
  ) {
    this.executor = new Executor(registry, secretsService);
  }

  async execute(flow: IFlow, vars: Record<string, any>): Promise<IContext> {
    return this.executor.run(flow, vars);
  }
}
