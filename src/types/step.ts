export interface IStreamlyStep {
  name: string;
  run: (context: any) => Promise<any>;
}
