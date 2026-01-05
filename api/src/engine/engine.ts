import { IStepRegistry, IContext, IFlow } from '../types';
import { Executor } from './executor';
import { SecretsService } from '../services/secrets.service';
import { Subject } from 'rxjs';
import type { IProgressEvent } from '../types';

export class Engine {
  private readonly executor: Executor;
  public readonly progress$ = new Subject<IProgressEvent>();

  constructor(
    private readonly registry: IStepRegistry,
    private readonly secretsService?: SecretsService,
  ) {
    this.executor = new Executor(registry, secretsService, this.progress$);
  }

  async execute(flow: IFlow, vars: Record<string, any>): Promise<IContext> {
    return this.executor.run(flow, vars);
  }
}
