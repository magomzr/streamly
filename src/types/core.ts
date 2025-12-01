export interface IContext {
  id: string;
  name: string;
  vars: Record<string, any>;
  logs: string[];
  [key: string]: any;
}

export interface IStreamlyStep {
  id?: string;
  type: string;
  settings?: Record<string, any>;
  run(ctx: IContext, settings: any): Promise<void>;
}
export interface IFlow {
  name: string;
  steps: IStreamlyStep[];
}

export type IStepConstructor = {
  stepType: string;
  new (): IStreamlyStep;
};
