import { DynamicExecutor, RandomGenerator } from "@nestia/e2e";
import chalk from "chalk";
import { sleep_for } from "tstl";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";

import { ShoppingConfiguration } from "../src/ShoppingConfiguration";
import { ShoppingGlobal } from "../src/ShoppingGlobal";
import { ShoppingChannelProvider } from "../src/providers/shoppings/systematic/ShoppingChannelProvider";
import { ShoppingSetupWizard } from "../src/setup/ShoppingSetupWizard";
import { ConnectionPool } from "./ConnectionPool";
import { ArgumentParser } from "./internal/ArgumentParser";
import { StopWatch } from "./internal/StopWatch";

export namespace TestAutomation {
  export interface IProps<T> {
    open(options: IOptions): Promise<T>;
    close(backend: T): Promise<void>;
  }

  export interface IOptions {
    reset: boolean;
    simultaneous: number;
    include?: string[];
    exclude?: string[];
    trace: boolean;
  }

  export const execute = async <T>(props: IProps<T>): Promise<void> => {
    // OPEN BACKEND SERVER
    const options: IOptions = await getOptions();
    if (options.reset) {
      await StopWatch.trace("Reset DB")(() =>
        ShoppingSetupWizard.schema(ShoppingGlobal.prisma),
      );
      await StopWatch.trace("Seed Data")(ShoppingSetupWizard.seed);
    }
    const backend: T = await props.open(options);

    // DO TEST
    const connection: ShoppingApi.IConnection = {
      host: `http://127.0.0.1:${ShoppingConfiguration.API_PORT()}`,
    };
    const report: DynamicExecutor.IReport = await DynamicExecutor.validate({
      prefix: "test",
      location: __dirname + "/features",
      parameters: () =>
        [
          new ConnectionPool({
            host: connection.host,
            encryption: connection.encryption,
          }),
        ] as const,
      filter: (func) =>
        (!options.include?.length ||
          (options.include ?? []).some((str) => func.includes(str))) &&
        (!options.exclude?.length ||
          (options.exclude ?? []).every((str) => !func.includes(str))),
      onComplete: (exec) => {
        const trace = (str: string) =>
          console.log(`  - ${chalk.green(exec.name)}: ${str}`);
        if (exec.error === null) {
          const elapsed: number =
            new Date(exec.completed_at).getTime() -
            new Date(exec.started_at).getTime();
          trace(`${chalk.yellow(elapsed.toLocaleString())} ms`);
        } else trace(chalk.red(exec.error.name));
      },
      simultaneous: options.simultaneous,
      wrapper: async (_name, closure, parameters) => {
        const [pool] = parameters;
        const channel: IShoppingChannel = await ShoppingChannelProvider.create({
          code: pool.channel,
          name: RandomGenerator.name(8),
        });
        try {
          return await closure(...parameters);
        } catch (error) {
          throw error;
        } finally {
          await ShoppingChannelProvider.destroy(channel.id);
        }
      },
    });

    // TERMINATE - WAIT FOR BACKGROUND EVENTS
    await sleep_for(2500);
    await props.close(backend);

    const exceptions: Error[] = report.executions
      .filter((exec) => exec.error !== null)
      .map((exec) => exec.error!);
    if (exceptions.length === 0) {
      console.log("Success");
      console.log("Elapsed time", report.time.toLocaleString(), `ms`);
    } else {
      if (options.trace !== false)
        for (const exp of exceptions) console.log(exp);
      console.log("Failed");
      console.log("Elapsed time", report.time.toLocaleString(), `ms`);
      process.exit(-1);
    }
  };
}

const getOptions = () =>
  ArgumentParser.parse<TestAutomation.IOptions>(
    async (command, prompt, action) => {
      command.option("--reset <true|false>", "reset local DB or not");
      command.option(
        "--simultaneous <number>",
        "number of simultaneous requests",
      );
      command.option("--include <string...>", "include feature files");
      command.option("--exclude <string...>", "exclude feature files");
      command.option("--trace <boolean>", "trace detailed errors");

      return action(async (options) => {
        if (typeof options.reset === "string")
          options.reset = options.reset === "true";
        options.reset ??= await prompt.boolean("reset")("Reset local DB");
        options.simultaneous = Number(
          options.simultaneous ??
            (await prompt.number("simultaneous")(
              "Number of simultaneous requests to make",
            )),
        );
        if (Number.isNaN(options.simultaneous)) options.simultaneous = 1;
        options.trace = options.trace !== ("false" as any);
        return options as TestAutomation.IOptions;
      });
    },
  );
