import { IFlow } from '.';

export type IBody = {
  flow: IFlow;
  vars?: Record<string, any>;
};
