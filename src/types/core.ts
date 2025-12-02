/*
  Context that travels through the flow execution.
  Contains variables, step outputs, logs, and execution metadata.
*/
export interface IContext {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  vars: Record<string, any>;
  steps: Record<string, any>;
  logs: string[];
  error?: {
    stepId: string;
    stepName?: string;
    message: string;
    attempt: number;
  };
}

/*
  Branch definition for conditional execution.
*/
export interface IBranch {
  condition: string;
  steps: IStepDefinition[];
}

/*
  Step definition from the UI/flow configuration.
  Represents what the user configures.
*/
export interface IStepDefinition {
  id: string;
  name?: string;
  type: string;
  settings?: Record<string, any>;
  retry?: {
    maxAttempts?: number;
  };
  branches?: IBranch[];
}

/*
  Step implementation that can be executed.
  All step classes must implement this interface.
*/
export interface IStepExecutor {
  run(ctx: IContext, settings: any): Promise<any>;
}

/*
  Flow definition containing name and step definitions.
  Sent from the UI when creating a flow.
*/
export interface IFlow {
  name: string;
  steps: IStepDefinition[];
}

/*
  Step constructor for the registry.
  Used to instantiate step executors.
*/
export type IStepConstructor = {
  stepType: string;
  new (): IStepExecutor;
};
