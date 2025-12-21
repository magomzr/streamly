import { IContext, IFlow } from './core';

export interface IExecutor {
  run(flow: IFlow, vars: Record<string, any>): Promise<IContext>;
}
