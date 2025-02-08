import { DynamicBenchmarker } from "@nestia/benchmark";
import cliProgress from "cli-progress";
import fs from "fs";
import os from "os";
import { IPointer } from "tstl";

import { ShoppingBackend } from "../../../src/ShoppingBackend";
import { ShoppingConfiguration } from "../../../src/ShoppingConfiguration";
import { ShoppingGlobal } from "../../../src/ShoppingGlobal";
import { ShoppingSetupWizard } from "../../../src/setup/ShoppingSetupWizard";
import { ArgumentParser } from "../../internal/ArgumentParser";
import { StopWatch } from "../../internal/StopWatch";

interface IOptions {
  reset: boolean;
  include?: string[];
  exclude?: string[];
  trace: boolean;
  count: number;
  threads: number;
  simultaneous: number;
}

const getOptions = () =>
  ArgumentParser.parse<IOptions>(async (command, prompt, action) => {
    command.option("--mode <string>", "target mode");
    command.option("--reset <true|false>", "reset local DB or not");
    command.option("--include <string...>", "include feature files");
    command.option("--exclude <string...>", "exclude feature files");
    command.option("--count <number>", "number of requests to make");
    command.option("--threads <number>", "number of threads to use");
    command.option(
      "--simultaneous <number>",
      "number of simultaneous requests to make",
    );
    return action(async (options) => {
      if (typeof options.reset === "string")
        options.reset = options.reset === "true";
      options.reset ??= await prompt.boolean("reset")("Reset local DB");
      options.trace = options.trace !== ("false" as any);
      options.count = Number(
        options.count ??
          (await prompt.number("count")("Number of requests to make")),
      );
      options.threads = Number(
        options.threads ??
          (await prompt.number("threads")("Number of threads to use")),
      );
      options.simultaneous = Number(
        options.simultaneous ??
          (await prompt.number("simultaneous")(
            "Number of simultaneous requests to make",
          )),
      );
      return options as IOptions;
    });
  });

const main = async (): Promise<void> => {
  // CONFIGURATIONS
  const options: IOptions = await getOptions();
  ShoppingGlobal.testing = true;

  if (options.reset) {
    await StopWatch.trace("Reset DB")(() =>
      ShoppingSetupWizard.schema(ShoppingGlobal.prisma),
    );
    await StopWatch.trace("Seed Data")(ShoppingSetupWizard.seed);
  }

  // BACKEND SERVER
  const backend: ShoppingBackend = new ShoppingBackend();
  await backend.open();

  // DO BENCHMARK
  const prev: IPointer<number> = { value: 0 };
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(options.count, 0);

  const report: DynamicBenchmarker.IReport = await DynamicBenchmarker.master({
    count: options.count,
    threads: options.threads,
    simultaneous: options.simultaneous,
    filter: (func) =>
      (!options.include?.length ||
        (options.include ?? []).some((str) => func.includes(str))) &&
      (!options.exclude?.length ||
        (options.exclude ?? []).every((str) => !func.includes(str))),
    progress: (value: number) => {
      if (value >= 100 + prev.value) {
        bar.update(value);
        prev.value = value;
      }
    },
    servant: `${__dirname}/servant.js`,
  });
  bar.update(options.count);
  bar.stop();

  // DOCUMENTATION
  try {
    await fs.promises.mkdir(`${ShoppingConfiguration.ROOT}/docs/benchmarks`, {
      recursive: true,
    });
  } catch {}
  await fs.promises.writeFile(
    `${ShoppingConfiguration.ROOT}/docs/benchmarks/${os
      .cpus()[0]
      .model.trim()
      .split("\\")
      .join("")
      .split("/")
      .join("")}.md`,
    DynamicBenchmarker.markdown(report),
    "utf8",
  );

  // CLOSE
  await backend.close();
};
main().catch((exp) => {
  console.error(exp);
  process.exit(-1);
});
