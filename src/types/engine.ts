import { IContext, IFlow } from './core';

export interface IExecutor {
  run(flow: IFlow, vars: any): Promise<IContext>;
}
