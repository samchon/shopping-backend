import { INestiaAgentPrompt, INestiaAgentProvider } from "@nestia/agent";
import { IHttpLlmApplication, IHttpLlmFunction } from "@samchon/openapi";
import OpenAI from "openai";
import typia from "typia";

import { IFunctionCallBenchmarkExpected } from "../structures/IFunctionCallBenchmarkExpected";

export namespace FunctionCallBenchmarkPredicator {
  export const isNext = async (props: {
    provider: INestiaAgentProvider;
    history: INestiaAgentPrompt | null;
  }): Promise<boolean> => {
    if (props.history?.type !== "text" || props.history.role !== "assistant")
      return false;
    const result: OpenAI.ChatCompletion =
      await props.provider.api.chat.completions.create(
        {
          model: props.provider.model,
          messages: [
            {
              role: "system",
              content: [
                "You are an helpful assistant.",
                "",
                "If what the assistant is saying seems to be asking for",
                "user's consent for what the assistant wants to do next,",
                "use the tools provided appropriately.",
              ].join("\n"),
            },
            {
              role: "assistant",
              content: props.history.text,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: functionSchema.name,
                description: functionSchema.description,
                parameters: functionSchema.parameters as Record<string, any>,
              },
            },
          ],
          tool_choice: "required",
          parallel_tool_calls: false,
        },
        props.provider.options,
      );
    const toolCall: OpenAI.ChatCompletionMessageToolCall | undefined = (
      result.choices[0]?.message.tool_calls ?? []
    ).filter(
      (tc) =>
        tc.type === "function" && tc.function.name === functionSchema.name,
    )?.[0];
    if (toolCall === undefined) return false;
    const input = JSON.parse(toolCall.function.arguments);
    return typia.is<IJudgeProps>(input) && input.next;
  };

  export const success = (props: {
    application: IHttpLlmApplication<"chatgpt">;
    operations: Map<Function, Function>;
    expected: IFunctionCallBenchmarkExpected;
    functionList: { function: IHttpLlmFunction<"chatgpt"> }[];
    strict: boolean;
  }): boolean => {
    const call = (
      expected: IFunctionCallBenchmarkExpected,
      overrideHistories?: { function: IHttpLlmFunction<"chatgpt"> }[],
    ) =>
      success({
        application: props.application,
        operations: props.operations,
        functionList: overrideHistories ?? props.functionList,
        expected,
        strict: props.strict,
      });

    switch (props.expected.type) {
      case "standalone":
        const target: IHttpLlmFunction<"chatgpt"> | undefined = getFunction({
          application: props.application,
          operations: props.operations,
          function: props.expected.function,
        });
        return props.functionList.some(({ function: func }) => func === target);
      case "allOf":
        return props.expected.allOf.every((expected) => call(expected));
      case "anyOf":
        return props.expected.anyOf.some((expected) => call(expected));
      case "array":
        const targetIterator = props.expected.items[Symbol.iterator]();
        let targeted = targetIterator.next();

        for (const history of props.functionList) {
          if (targeted.done) {
            return true;
          }

          if (call(targeted.value, [history])) {
            targeted = targetIterator.next();
            continue;
          }

          if (props.strict) {
            return false;
          }
        }
        return !!targeted.done;
    }
  };

  const getFunction = (props: {
    application: IHttpLlmApplication<"chatgpt">;
    operations: Map<Function, Function>;
    function: Function;
  }): IHttpLlmFunction<"chatgpt"> | undefined => {
    return props.application.functions.find(
      (func) =>
        func.operation()["x-samchon-accessor"]?.at(-1) ===
          props.function.name &&
        func.operation()["x-samchon-controller"] ===
          props.operations.get(props.function)?.name,
    );
  };
}

const functionSchema = typia.llm.application<
  IPredicatorApplication,
  "chatgpt"
>().functions[0];

interface IPredicatorApplication {
  /**
   * Judget whether the assistant saying seems to askinng for
   * user's consent for what the assistant wants to do next.
   *
   * If the assistant is suggesting user to call some functions,
   * you A.I. agent also have to this function too.
   */
  judge(props: IJudgeProps): void;
}
interface IJudgeProps {
  /**
   * Whether the next step waiting for the user's consent exists or not.
   */
  next: boolean;
}
