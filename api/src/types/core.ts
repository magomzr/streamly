// Re-export shared types
export type { IContext, IFlow, IStepDefinition } from '@streamly/shared';
import type { IContext } from '@streamly/shared';

/*
  Step implementation that can be executed.
  All step classes must implement this interface.
*/
export interface IStepExecutor {
  run(ctx: IContext, settings: any): Promise<any>;
}

/*
  Step constructor for the registry.
  Used to instantiate step executors.
*/
export type IStepConstructor = {
  stepType: string;
  new (): IStepExecutor;
};
