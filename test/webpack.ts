import { DynamicExecutor } from "@nestia/e2e";
import chalk from "chalk";
import cp from "child_process";
import { sleep_for } from "tstl";

import { ShoppingConfiguration } from "../src/ShoppingConfiguration";
import { ShoppingGlobal } from "../src/ShoppingGlobal";
import ShoppingApi from "../src/api";
import { ShoppingSetupWizard } from "../src/setup/ShoppingSetupWizard";
import { ArgumentParser } from "../src/utils/ArgumentParser";
import { ConnectionPool } from "./ConnectionPool";
import { StopWatch } from "./internal/StopWatch";

interface IOptions {
  reset: boolean;
  include?: string[];
  exclude?: string[];
  trace: boolean;
}

const getOptions = () =>
  ArgumentParser.parse<IOptions>(async (command, prompt, action) => {
    command.option("--reset <true|false>", "reset local DB or not");
    command.option("--include <string...>", "include feature files");
    command.option("--exclude <string...>", "exclude feature files");
    command.option("--trace <boolean>", "trace detailed errors");

    return action(async (options) => {
      if (typeof options.reset === "string")
        options.reset = options.reset === "true";
      options.reset ??= await prompt.boolean("reset")("Reset local DB");
      options.trace = options.trace !== ("false" as any);
      return options as IOptions;
    });
  });

async function main(): Promise<void> {
  // UNEXPECTED ERRORS
  global.process.on("uncaughtException", console.error);
  global.process.on("unhandledRejection", console.error);

  // CONFIGURE
  const options: IOptions = await getOptions();
  ShoppingGlobal.testing = true;

  if (options.reset) {
    await StopWatch.trace("Reset DB")(() =>
      ShoppingSetupWizard.schema(ShoppingGlobal.prisma)
    );
    await StopWatch.trace("Seed Data")(ShoppingSetupWizard.seed);
  }

  // OPEN SERVER
  const backend: cp.ChildProcess = cp.fork("server.js", {
    cwd: `${ShoppingConfiguration.ROOT}/dist`,
  });
  await sleep_for(2_500);

  // DO TEST
  const connection: ShoppingApi.IConnection = {
    host: `http://127.0.0.1:${ShoppingConfiguration.API_PORT()}`,
  };
  const report: DynamicExecutor.IReport = await DynamicExecutor.validate({
    prefix: "test",
    location: __dirname + "/features",
    parameters: () => [
      new ConnectionPool({
        host: connection.host,
        encryption: connection.encryption,
      }),
    ],
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
  });

  // TERMINATE
  await sleep_for(2500); // WAIT FOR BACKGROUND EVENTS
  backend.kill();

  const exceptions: Error[] = report.executions
    .filter((exec) => exec.error !== null)
    .map((exec) => exec.error!);
  if (exceptions.length === 0) {
    console.log("Success");
    console.log("Elapsed time", report.time.toLocaleString(), `ms`);
  } else {
    if (options.trace !== false) for (const exp of exceptions) console.log(exp);
    console.log("Failed");
    console.log("Elapsed time", report.time.toLocaleString(), `ms`);
    process.exit(-1);
  }
}
main().catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
