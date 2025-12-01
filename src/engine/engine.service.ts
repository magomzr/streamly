import { Injectable, Logger } from '@nestjs/common';
import { StepRegistry } from 'src/registry/stepRegistry';
import { Engine } from './engine';
import { IContext } from 'src/types';

@Injectable()
export class EngineService {
  private readonly logger = new Logger(EngineService.name);

  private readonly registry = new StepRegistry();
  private readonly engine = new Engine(this.registry);

  async runFlow(flow: any, input: any): Promise<IContext> {
    this.logger.log(`Running flow: ${flow.name}`);
    return this.engine.execute(flow, input);
  }

  registerStep(step: any): void {
    this.logger.log(`Registering step: ${step.name}`);
    this.registry.register(step);
  }
}
