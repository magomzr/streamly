import { IStep, IStepConstructor, IStepRegistry } from 'src/types';

export class StepRegistry implements IStepRegistry {
  private steps = new Map<string, IStep>();

  register(stepCtor: IStepConstructor): void {
    this.steps.set(stepCtor.stepType, new stepCtor());
  }

  resolve(type: string): IStepConstructor {
    const ctor = this.steps.get(type);
    if (!ctor) throw new Error(`Unknown step type: ${type}`);

    return ctor.constructor as IStepConstructor;
  }
}
