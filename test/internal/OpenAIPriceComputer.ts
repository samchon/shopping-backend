import { INestiaAgentTokenUsage } from "@nestia/agent";

export namespace OpenAIPriceComputer {
  export interface IOutput {
    total: number;
    prompt: number;
    completion: number;
  }
  export const get = (usage: INestiaAgentTokenUsage): IOutput => {
    const prompt: number =
      (usage.prompt.total - usage.prompt.cached) * (2.5 / 1_000_000) +
      usage.prompt.cached * (1.25 / 1_000_000);
    const completion: number = usage.completion.total * (10.0 / 1_000_000);
    return {
      total: prompt + completion,
      prompt,
      completion,
    };
  };
}
