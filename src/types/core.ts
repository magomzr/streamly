/*
 This is the context interface that will attached to each step during execution.
 It holds variables, logs, and other relevant information about the flow execution.
 It supposed to be sent by the UI and its life cycle is only during the execution of a flow.
 It is tended to be persisted in the future for auditing and debugging purposes.
*/
export interface IContext {
  id: string;
  name: string;
  vars: Record<string, any>;
  steps: Record<string, any>;
  logs: string[];
  [key: string]: any;
}

/*
  This is the interface that all steps must implement. It defines the structure and behavior
  of a step within a flow. Each step must have an id, a name and a type. This must be sent
  from the UI when creating a flow.
*/
export interface IStep {
  id?: string;
  name?: string;
  type: string;
  settings?: Record<string, any>;
}

/*
  This is the interface for the step registry, which is responsible for registering
  and resolving step constructors based on their type. It is an extension of the IStep
  with the run method that all steps must implement.
*/
export interface IStreamlyStep extends IStep {
  run(ctx: IContext, settings: any): Promise<any>;
}

/*
  This is the interface for a flow, which consists of a name and an array of steps.
  It is used to represent a flow in the application. It is sent from the UI when creating
  a flow.
*/
export interface IFlow {
  name: string;
  steps: IStep[];
}

/*
  This is the interface for the step constructor, which is responsible for creating
  instances of steps.
*/
export type IStepConstructor = {
  stepType: string;
  new (): IStreamlyStep;
};
