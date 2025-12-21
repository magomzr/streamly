import { IStepConstructor } from './core';

export interface IStepRegistry {
  register(step: IStepConstructor): void;
  resolve(type: string): IStepConstructor;
}
