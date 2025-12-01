import { IContext, IFlow } from './core';

export interface IExecutor {
  run(flow: IFlow, input: any): Promise<IContext>;
}
