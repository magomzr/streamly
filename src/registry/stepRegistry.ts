import { IStepConstructor, IStepRegistry } from 'src/types';

export class StepRegistry implements IStepRegistry {
  private steps = new Map<string, IStepConstructor>();

  register(stepCtor: IStepConstructor): void {
    this.steps.set(stepCtor.stepType, stepCtor);
  }

  resolve(type: string): IStepConstructor {
    const ctor = this.steps.get(type);
    if (!ctor) throw new Error(`Unknown step type: ${type}`);
    return ctor;
  }
}
