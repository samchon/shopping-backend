import { INestiaAgentProvider } from "@nestia/agent";
import { INestApplication } from "@nestjs/common";
import { NestContainer } from "@nestjs/core";
import { Module } from "@nestjs/core/injector/module";
import {
  HttpLlm,
  IHttpLlmApplication,
  OpenApi,
  OpenApiV3,
  OpenApiV3_1,
  SwaggerV2,
} from "@samchon/openapi";
import chalk from "chalk";
import cp from "child_process";
import fs from "fs";
import OpenAI from "openai";
import path from "path";
import { Semaphore } from "tstl";
import typia from "typia";

import { ShoppingBackend } from "../../../src/ShoppingBackend";
import { ShoppingConfiguration } from "../../../src/ShoppingConfiguration";
import { ShoppingGlobal } from "../../../src/ShoppingGlobal";
import { ArgumentParser } from "../../../src/utils/ArgumentParser";
import { ConnectionPool } from "../../ConnectionPool";
import { test_api_shopping_actor_customer_join } from "../../features/api/shoppings/actors/test_api_shopping_actor_customer_join";
import { FunctionCallBenchmarkExecutor } from "./executors/FunctionCallBenchmarkExecutor";
import { FunctionCallBenchmarkReporter } from "./executors/FunctionCallBenchmarkReporter";
import { IFunctionCallBenchmarkExpected } from "./structures/IFunctionCallBenchmarkExpected";
import { IFunctionCallBenchmarkOptions } from "./structures/IFunctionCallBenchmarkOptions";
import { IFunctionCallBenchmarkResult } from "./structures/IFunctionCallBenchmarkResult";
import { IFunctionCallBenchmarkScenario } from "./structures/IFunctionCallBenchmarkScenario";

const SCENARIO_LOCATION = path.resolve(
  `${ShoppingConfiguration.ROOT}/bin/test/benchmark/call/scenarios`,
);

interface IOptions extends IFunctionCallBenchmarkOptions {
  semaphore: number;
}

interface IScenario extends IFunctionCallBenchmarkScenario {
  location: string;
}

const getOptions = () =>
  ArgumentParser.parse<IOptions>(async (command, prompt, action) => {
    command.option("--model <string>", "target model");
    command.option("--count <number>", "count of executions per scenario");
    command.option("--capacity <number>", "dividing count");
    command.option("--semaphore <number>", "semaphore size");
    command.option("--timeout <number>", "timeout for each execution");
    command.option("--include <string...>", "include feature files");
    command.option("--exclude <string...>", "exclude feature files");

    return action(async (options) => {
      // TARGET MODEL
      options.model ??= (await prompt.select("model")("Select model")([
        "gpt-4o",
        "gpt-4o-mini",
      ])) as "gpt-4o" | "gpt-4o-mini";

      // COUNT
      if (typeof options.count === "string")
        options.count = Number(options.count);
      options.count ??= await prompt.number("count")(
        "Count of executions per scenario (default 10)",
        10,
      );

      // SEMAPHORE
      if (typeof options.semaphore === "string")
        options.semaphore = Number(options.semaphore);
      options.semaphore ??= await prompt.number("semaphore")(
        "Semaphore size (default 100)",
        100,
      );

      // CAPACITY
      if (typeof options.capacity === "string")
        options.capacity = Number(options.capacity);
      options.capacity ??= await prompt.number("capacity")(
        "Capacity count per agent (divide and conquer, default 100)",
        100,
      );

      // TIMEOUT
      if (typeof options.timeout === "string")
        options.timeout = Number(options.timeout);
      options.timeout ??= await prompt.number("timeout")(
        "Timeout for each execution (default 180s)",
        180,
      );

      return options as IOptions;
    });
  });

const getControllers = (app: INestApplication): Map<Function, Function> => {
  const container: NestContainer = (app as any).container as NestContainer;
  const modules: Module[] = [...container.getModules().values()].filter(
    (m) => !!m.controllers.size,
  );
  const dict: Map<Function, Function> = new Map();
  for (const m of modules)
    for (const controller of m.controllers.keys())
      if (typeof controller === "function")
        for (const method of getMethods(controller.prototype))
          dict.set(method, controller);
  return dict;
};

const getMethods = (controller: any): Function[] => {
  const methods: Function[] = [];
  while (controller) {
    for (const key of Object.getOwnPropertyNames(controller))
      if (typeof controller[key] === "function" && key !== "constructor")
        methods.push(controller[key]);
    controller = Object.getPrototypeOf(controller);
  }
  return methods;
};

const collectScenarios = async (props: {
  application: IHttpLlmApplication<"chatgpt">;
  operations: Map<Function, Function>;
  options: IOptions;
  location: string;
}): Promise<IScenario[]> => {
  const collection: IScenario[] = [];
  for (const file of await fs.promises.readdir(props.location)) {
    const next: string = path.resolve(`${props.location}/${file}`);
    const stat: fs.Stats = await fs.promises.lstat(next);
    if (stat.isDirectory())
      collection.push(
        ...(await collectScenarios({
          application: props.application,
          operations: props.operations,
          options: props.options,
          location: next,
        })),
      );
    else if (file.endsWith(".js")) {
      const modulo = await import(next);
      for (const [key, value] of Object.entries(modulo)) {
        if (typeof value !== "function") continue;
        else if (
          !!props.options.include?.length &&
          props.options.include.every((o) => key.includes(o) === false)
        )
          continue;
        else if (
          !!props.options.exclude?.length &&
          props.options.exclude.some((o) => key.includes(o) === true)
        )
          continue;
        const scenario: IFunctionCallBenchmarkScenario = value();
        if (
          typia.is<IFunctionCallBenchmarkScenario>(scenario) &&
          isExistingFunction({
            application: props.application,
            operations: props.operations,
            expected: scenario.expected,
          })
        )
          collection.push({
            ...scenario,
            location: next
              .substring(
                SCENARIO_LOCATION.length + path.sep.length,
                next.length - 3,
              )
              .split(path.sep)
              .join("/"),
          });
      }
    }
  }
  return collection;
};

const isExistingFunction = (props: {
  application: IHttpLlmApplication<"chatgpt">;
  operations: Map<Function, Function>;
  expected: IFunctionCallBenchmarkExpected;
}): boolean => {
  if (props.expected.type === "standalone") {
    const target: Function = props.expected.function;
    return props.application.functions.some(
      (func) =>
        func.operation()["x-samchon-controller"] ===
          props.operations.get(target)?.name &&
        func.operation()["x-samchon-accessor"]?.at(-1) === target.name,
    );
  } else if (props.expected.type === "allOf")
    return props.expected.allOf.every((expected) =>
      isExistingFunction({
        ...props,
        expected,
      }),
    );
  else if (props.expected.type === "anyOf")
    return props.expected.anyOf.every((expected) =>
      isExistingFunction({
        ...props,
        expected,
      }),
    );
  else if (props.expected.type === "array")
    return props.expected.items.every((expected) =>
      isExistingFunction({
        ...props,
        expected,
      }),
    );
  else return false;
};

const main = async (): Promise<void> => {
  if (ShoppingGlobal.env.OPENAI_API_KEY === undefined)
    throw new Error(
      "OpenAI API key is not defined. Configure it to the .env file first.",
    );

  // PREPARE OPTIONS
  const options: IOptions = await getOptions();
  if (options.swagger === true)
    cp.execSync("npm run build:swagger", {
      cwd: ShoppingConfiguration.ROOT,
      stdio: "inherit",
    });
  ShoppingGlobal.testing = true;

  // BACKEND SERVER
  const backend: ShoppingBackend = new ShoppingBackend();
  await backend.open();

  // COMPOSE LLM APPLICATION SCHEMA
  const application: IHttpLlmApplication<"chatgpt"> = HttpLlm.application({
    model: "chatgpt",
    document: OpenApi.convert(
      typia.json.assertParse<
        SwaggerV2.IDocument | OpenApiV3.IDocument | OpenApiV3_1.IDocument
      >(
        await fetch(
          `http://127.0.0.1:${ShoppingConfiguration.API_PORT()}/editor/swagger.json`,
        ).then((r) => r.text()),
      ),
    ),
    options: {
      reference: true,
    },
  });
  application.functions = application.functions.filter((func) =>
    func.path.startsWith("/shoppings/customers"),
  );

  // CLIENT ASSETS
  const operations: Map<Function, Function> = getControllers(
    backend["application_"]!,
  );
  const semaphore: Semaphore = new Semaphore(options.semaphore);
  const provider: INestiaAgentProvider = {
    type: "chatgpt",
    api: new OpenAI({
      apiKey: ShoppingGlobal.env.OPENAI_API_KEY,
    }),
    model: options.model,
  };
  const pool: ConnectionPool = new ConnectionPool({
    host: `http://127.0.0.1:${ShoppingConfiguration.API_PORT()}`,
  });
  await test_api_shopping_actor_customer_join(pool);

  const scenarios: IScenario[] = await collectScenarios({
    application,
    operations,
    options,
    location: SCENARIO_LOCATION,
  });
  console.log("Number of scenarios: #" + scenarios.length.toLocaleString());

  // DO BENCHMARK
  if (scenarios.length === 0) console.log("No scenario exists");
  else {
    const results: IFunctionCallBenchmarkResult[] = await Promise.all(
      scenarios.map(async (s) => {
        const start: number = Date.now();
        const res: IFunctionCallBenchmarkResult =
          await FunctionCallBenchmarkExecutor.execute({
            provider: provider,
            application,
            operations,
            connection: pool.customer,
            options,
            semaphore,
            scenario: s,
            location: s.location,
          });
        const success: number = res.trials.filter((t) => t.execute).length;
        const ratio: number = success / res.trials.length;
        console.log(
          (success === 0
            ? chalk.redBright
            : ratio < 0.25
              ? chalk.hex("#ff6600")
              : ratio < 0.5
                ? chalk.yellowBright
                : ratio < 0.75
                  ? chalk.cyanBright
                  : chalk.greenBright)(s.title),
          "-",
          chalk.yellowBright(success.toLocaleString()),
          "of",
          chalk.yellowBright(options.count.toLocaleString()),
          (Date.now() - start).toLocaleString(),
          "ms",
        );
        return res;
      }),
    );
    await FunctionCallBenchmarkReporter.execute({
      options,
      results,
    });
  }

  // TERMINATE LOCAL SERVER
  await backend.close();
};
main().catch((error) => {
  console.log(error);
  process.exit(-1);
});
