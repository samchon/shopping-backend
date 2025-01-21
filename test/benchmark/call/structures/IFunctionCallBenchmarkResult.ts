import {
  INestiaAgentEvent,
  INestiaAgentPrompt,
  INestiaAgentTokenUsage,
} from "@nestia/agent";
import { IFunctionCallBenchmarkScenario } from "./IFunctionCallBenchmarkScenario";

export interface IFunctionCallBenchmarkResult {
  location: string;
  scenario: IFunctionCallBenchmarkScenario;
  trials: IFunctionCallBenchmarkResult.ITrial[];
}
export namespace IFunctionCallBenchmarkResult {
  export interface ITrial {
    histories: INestiaAgentPrompt[];
    responses: INestiaAgentEvent.IResponse[];
    usage: INestiaAgentTokenUsage;
    select: boolean;
    execute: boolean;
    error: null | Error;
    started_at: Date;
    completed_at: Date;
  }
}
