import { Injectable, Logger } from '@nestjs/common';
import { StepRegistry } from '../registry/stepRegistry';
import { Engine } from './engine';
import { IContext, IFlow, IStepConstructor } from '../types';
import { SecretsService } from '../services/secrets.service';

@Injectable()
export class EngineService {
  private readonly logger = new Logger(EngineService.name);
  private readonly engine: Engine;

  constructor(
    private readonly registry: StepRegistry,
    private readonly secretsService: SecretsService,
  ) {
    this.engine = new Engine(this.registry, this.secretsService);
  }

  async runFlow(flow: IFlow, vars: Record<string, any>): Promise<IContext> {
    this.logger.log(`Running flow: ${flow.name}`);
    return this.engine.execute(flow, vars);
  }

  registerStep(step: IStepConstructor): void {
    this.logger.log(`Registering step: ${step.stepType}`);
    this.registry.register(step);
  }
}
