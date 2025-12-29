import { Injectable } from '@nestjs/common';
import { IStepConstructor, IStepRegistry } from '../types';

@Injectable()
export class StepRegistry implements IStepRegistry {
  private readonly steps = new Map<string, IStepConstructor>();

  register(stepCtor: IStepConstructor): void {
    this.steps.set(stepCtor.stepType, stepCtor);
  }

  resolve(type: string): IStepConstructor {
    const ctor = this.steps.get(type);
    if (!ctor) throw new Error(`Unknown step type: ${type}`);
    return ctor;
  }
}
