import { IFunctionCallBenchmarkExpected } from "./IFunctionCallBenchmarkExpected";

export interface IFunctionCallBenchmarkScenario {
  title: string;
  prompt: string;
  expected: IFunctionCallBenchmarkExpected;
}
