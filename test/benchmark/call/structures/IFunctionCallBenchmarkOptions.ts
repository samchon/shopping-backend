import OpenAI from "openai";

export interface IFunctionCallBenchmarkOptions {
  swagger: boolean;
  model: OpenAI.ChatModel;
  count: number;
  capacity: number;
  timeout: number;
  include?: string[];
  exclude?: string[];
}
