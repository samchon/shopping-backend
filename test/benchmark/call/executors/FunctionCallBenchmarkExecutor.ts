import {
  INestiaAgentEvent,
  INestiaAgentProvider,
  NestiaAgent,
} from "@nestia/agent";
import { IConnection } from "@nestia/fetcher";
import { IHttpLlmApplication } from "@samchon/openapi";
import { Semaphore } from "tstl";

import { IFunctionCallBenchmarkOptions } from "../structures/IFunctionCallBenchmarkOptions";
import { IFunctionCallBenchmarkResult } from "../structures/IFunctionCallBenchmarkResult";
import { IFunctionCallBenchmarkScenario } from "../structures/IFunctionCallBenchmarkScenario";
import { FunctionCallBenchmarkPredicator } from "./FunctionCallBenchmarkPredicator";

export namespace FunctionCallBenchmarkExecutor {
  export interface IProps {
    application: IHttpLlmApplication<"chatgpt">;
    operations: Map<Function, Function>;
    provider: INestiaAgentProvider;
    connection: IConnection;
    options: IFunctionCallBenchmarkOptions;
    semaphore: Semaphore;
    scenario: IFunctionCallBenchmarkScenario;
    location: string;
  }

  export const execute = async (
    props: IProps,
  ): Promise<IFunctionCallBenchmarkResult> => {
    const trials: IFunctionCallBenchmarkResult.ITrial[] = await Promise.all(
      new Array(props.options.count).fill(0).map(async () => {
        await props.semaphore.acquire();
        const tr: IFunctionCallBenchmarkResult.ITrial = await process(props);
        await props.semaphore.release();
        return tr;
      }),
    );
    return {
      location: props.location,
      scenario: props.scenario,
      trials,
    };
  };

  export const process = async (
    props: IProps,
  ): Promise<IFunctionCallBenchmarkResult.ITrial> => {
    const started_at: Date = new Date();
    const responses: INestiaAgentEvent.IResponse[] = [];

    const agent: NestiaAgent = new NestiaAgent({
      controllers: [
        {
          protocol: "http",
          name: "connectors",
          application: props.application,
          connection: props.connection,
        },
      ],
      provider: props.provider,
      config: {
        capacity: props.options.capacity,
        eliticism: true,
        locale: "en-US",
      },
    });
    agent.on("response", async (r) => {
      responses.push(r);
    });

    try {
      await agent.conversate(props.scenario.prompt);
      while (
        (Date.now() - started_at.getTime()) / 1000 < props.options.timeout &&
        FunctionCallBenchmarkPredicator.success({
          application: props.application,
          operations: props.operations,
          expected: props.scenario.expected,
          functionList: agent
            .getPromptHistories()
            .filter((h) => h.type === "execute")
            .filter((h) => h.protocol === "http"),
          strict: false,
        }) === false &&
        (await FunctionCallBenchmarkPredicator.isNext({
          provider: props.provider,
          history: agent.getPromptHistories().at(-1) ?? null,
        })) === true
      )
        await agent.conversate(
          "Okay, go ahead and don't ask me any more questions, just make your own decisions.",
        );

      return {
        responses,
        histories: agent.getPromptHistories(),
        usage: agent.getTokenUsage(),
        select: FunctionCallBenchmarkPredicator.success({
          application: props.application,
          operations: props.operations,
          expected: props.scenario.expected,
          functionList: agent
            .getPromptHistories()
            .filter((h) => h.type === "select")
            .map((h) => h.operations)
            .flat()
            .filter((h) => h.protocol === "http"),
          strict: false,
        }),
        execute: FunctionCallBenchmarkPredicator.success({
          application: props.application,
          operations: props.operations,
          expected: props.scenario.expected,
          functionList: agent
            .getPromptHistories()
            .filter((h) => h.type === "execute")
            .filter((h) => h.protocol === "http"),
          strict: false,
        }),
        error: null,
        started_at,
        completed_at: new Date(),
      };
    } catch (error) {
      console.log(error);
      return {
        responses,
        histories: agent.getPromptHistories(),
        usage: agent.getTokenUsage(),
        select: false,
        execute: false,
        error: error as Error,
        started_at,
        completed_at: new Date(),
      };
    }
  };
}
