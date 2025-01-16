import { INestiaAgentTokenUsage } from "@nestia/agent";
import fs from "fs";
import path from "path";

import { ShoppingConfiguration } from "../../../../src/ShoppingConfiguration";
import { OpenAIPriceComputer } from "../../../internal/OpenAIPriceComputer";
import { IFunctionCallBenchmarkOptions } from "../structures/IFunctionCallBenchmarkOptions";
import { IFunctionCallBenchmarkResult } from "../structures/IFunctionCallBenchmarkResult";
import { IFunctionCallBenchmarkScenario } from "../structures/IFunctionCallBenchmarkScenario";

export namespace FunctionCallBenchmarkReporter {
  export interface IProps {
    options: IFunctionCallBenchmarkOptions;
    results: IFunctionCallBenchmarkResult[];
  }

  export const execute = async (props: IProps): Promise<void> => {
    await prepare();

    const everything: IFunctionCallBenchmarkResult.ITrial[] = props.results
      .map((r) => r.trials)
      .flat();
    const usage: INestiaAgentTokenUsage = aggregateUsages(
      everything.map((t) => t.usage),
    );
    const price: OpenAIPriceComputer.IOutput = OpenAIPriceComputer.get(usage);

    const content: string[] = [
      "# LLM Function Selection Benchmark",
      "## Summary",
      `  - Arguments:`,
      `    - \`count\`: ${props.options.count}`,
      `    - \`include\`: ${(props.options.include ?? []).join(", ")}`,
      `    - \`exclude\`: ${(props.options.exclude ?? []).join(", ")}`,
      `  - Aggregation:`,
      `    - Trial: ${everything.length}`,
      `    - Select:`,
      `      - Success: ${everything.filter((e) => e.select).length}`,
      `      - Failure: ${everything.filter((e) => !e.select).length}`,
      `    - Execute:`,
      `      - Success: ${everything.filter((e) => e.execute).length}`,
      `      - Failure: ${everything.filter((e) => !e.execute).length}`,
      `    - Average Time: ${(everything.map((e) => e.completed_at.getTime() - e.started_at.getTime()).reduce((a, b) => a + b, 0) / everything.length).toLocaleString()} ms`,
      `  - Token Usage ($${price.total.toLocaleString()}):`,
      `    - Total: ${usage.total.toLocaleString()}`,
      `    - Prompt ($${price.prompt.toLocaleString()}):`,
      `      - Total: ${usage.prompt.total.toLocaleString()}`,
      `      - Audio: ${usage.prompt.audio.toLocaleString()}`,
      `      - Cached: ${usage.prompt.cached.toLocaleString()}`,
      `    - Completion ($${price.completion.toLocaleString()}):`,
      `      - Total: ${usage.completion.total.toLocaleString()}`,
      `      - Accepted Prediction: ${usage.completion.accepted_prediction.toLocaleString()}`,
      `      - Audio: ${usage.completion.audio.toLocaleString()}`,
      `      - Reasoning: ${usage.completion.reasoning.toLocaleString()}`,
      `      - Rejected Prediction: ${usage.completion.rejected_prediction.toLocaleString()}`,
      "",
      "## Scenarios",
      " title | select | execute | success cost | failure cost ",
      "-------|-------:|--------:|-------------:|-------------:",
      ...props.results.map((r) => {
        return [
          `[${r.scenario.title}](./${r.location}/README.md)`,
          [
            ...new Array(r.trials.filter((t) => t.select).length).fill("■"),
            ...new Array(r.trials.filter((t) => !t.select).length).fill("□"),
          ].join(""),
          [
            ...new Array(r.trials.filter((t) => t.execute).length).fill("■"),
            ...new Array(r.trials.filter((t) => !t.execute).length).fill("□"),
          ].join(""),
          ...[true, false].map(
            (success) =>
              "$" +
              OpenAIPriceComputer.get(
                aggregateUsages(
                  r.trials
                    .filter((t) => t.execute === success)
                    .map((t) => t.usage),
                ),
              ).total.toLocaleString(),
          ),
        ].join(" | ");
      }),
    ];

    const index: string = path.resolve(`${LOCATION}/README.md`);
    console.log(`Report has been written to ${JSON.stringify(index)}`);
    await fs.promises.writeFile(index, content.join("\n"), "utf8");
    await Promise.all(props.results.map(reportResult));
  };

  const reportResult = async (
    result: IFunctionCallBenchmarkResult,
  ): Promise<void> => {
    const usage: INestiaAgentTokenUsage = aggregateUsages(
      result.trials.map((t) => t.usage),
    );
    const price: OpenAIPriceComputer.IOutput = OpenAIPriceComputer.get(usage);
    const content: string[] = [
      `# ${result.scenario.title}`,
      `## Prompt`,
      result.scenario.prompt,
      ``,
      `## Summary`,
      `  - Select:`,
      `    - Success: ${result.trials.filter((t) => t.select).length}`,
      `    - Failure: ${result.trials.filter((t) => !t.select).length}`,
      `  - Execute:`,
      `    - Success: ${result.trials.filter((t) => t.execute).length}`,
      `    - Failure: ${result.trials.filter((t) => !t.execute).length}`,
      `  - Success Cost: $${price.total.toLocaleString()}`,
      `  - Failure Cost: $${price.total.toLocaleString()}`,
      `  - Average Time: ${
        result.trials
          .map((t) => t.completed_at.getTime() - t.started_at.getTime())
          .reduce((a, b) => a + b, 0) / result.trials.length
      } ms`,
      "",
      `## Trials`,
      " index | select | execute | cost | file ",
      "-------|-------:|--------:|-----:|------",
      ...result.trials.map((t, i) => {
        const file: string = `./${i + 1}.${t.select ? "success" : "failure"}.${t.execute ? "success" : "failure"}.md`;
        return [
          (i + 1).toLocaleString(),
          t.select ? "success" : "failure",
          t.execute ? "success" : "failure",
          "$" + OpenAIPriceComputer.get(t.usage).total.toLocaleString(),
          `[${file}](${file})`,
        ].join(" | ");
      }),
    ];

    await fs.promises.mkdir(path.resolve(`${LOCATION}/${result.location}`), {
      recursive: true,
    });
    await fs.promises.writeFile(
      path.resolve(`${LOCATION}/${result.location}/README.md`),
      content.join("\n"),
      "utf8",
    );
    await Promise.all(
      result.trials.map((t, i) =>
        reportTrial({
          directory: `${LOCATION}/${result.location}`,
          fileName: `${i + 1}.${t.select ? "success" : "failure"}.${t.execute ? "success" : "failure"}`,
          scenario: result.scenario,
          trial: t,
        }),
      ),
    );
  };

  const reportTrial = async (p: {
    directory: string;
    fileName: string;
    scenario: IFunctionCallBenchmarkScenario;
    trial: IFunctionCallBenchmarkResult.ITrial;
  }): Promise<void> => {
    const price = OpenAIPriceComputer.get(p.trial.usage);
    const content: string[] = [
      `# ${p.scenario.title}`,
      `## Prompt`,
      p.scenario.prompt,
      ``,
      `## Summary`,
      `  - Status: ${p.trial.execute ? "success" : "failure"}`,
      `  - Token Usage: $${price.total.toLocaleString()}`,
      `    - Prompt: $${price.prompt.toLocaleString()}`,
      `      - Total: ${p.trial.usage.prompt.total.toLocaleString()}`,
      `      - Audio: ${p.trial.usage.prompt.audio.toLocaleString()}`,
      `      - Cached: ${p.trial.usage.prompt.cached.toLocaleString()}`,
      `    - Completion: $${price.completion.toLocaleString()}`,
      `      - Total: ${p.trial.usage.completion.total.toLocaleString()}`,
      `      - Accepted Prediction: ${p.trial.usage.completion.accepted_prediction.toLocaleString()}`,
      `      - Audio: ${p.trial.usage.completion.audio.toLocaleString()}`,
      `      - Reasoning: ${p.trial.usage.completion.reasoning.toLocaleString()}`,
      `      - Rejected Prediction: ${p.trial.usage.completion.rejected_prediction.toLocaleString()}`,
      `  - Time: ${(p.trial.completed_at.getTime() - p.trial.started_at.getTime()).toLocaleString()} ms`,
      ``,
      `## Function Calls`,
      `### Selections`,
      ...p.trial.histories
        .filter((h) => h.type === "select")
        .map((h) => h.operations)
        .flat()
        .filter((o) => o.protocol === "http")
        .map(
          (r) =>
            `  - \`${r.function.method.toUpperCase()} ${r.function.path}\`: ${r.reason}`,
        ),
      "",
      `### Completions`,
      ...p.trial.histories
        .filter((h) => h.type === "execute")
        .filter((h) => h.protocol === "http")
        .map((h) => [
          `  - \`${h.function.method.toUpperCase()} ${h.function.path}\`: ${h.value.status}`,
        ])
        .flat(),
      "",
      `## History`,
      ...p.trial.histories
        .map((h) => {
          if (h.type === "text") return [`### Text (${h.role})`, h.text, ""];
          else if (h.type === "describe")
            return [
              `### Describe`,
              h.text,
              "",
              ...h.executions
                .filter((e) => e.protocol === "http")
                .map((e) => [
                  `#### \`${e.function.method.toUpperCase()} ${e.function.path}\``,
                  `Status: ${e.value.status}`,
                  "",
                  `<details>`,
                  `  <summary> Arguments </summary>`,
                  ``,
                  "```json",
                  JSON.stringify(e.arguments, null, 2),
                  "```",
                  ``,
                  `</details>`,
                  "",
                  `<details>`,
                  `  <summary> Response </summary>`,
                  "",
                  "```json",
                  JSON.stringify(e.value, null, 2),
                  "```",
                  "",
                  `</details>`,
                  "",
                ])
                .flat(),
              "",
            ];
          else if (h.type === "select")
            return [
              `### Select`,
              ...h.operations
                .filter((o) => o.protocol === "http")
                .map(
                  (o) =>
                    `  - \`${o.function.method.toUpperCase()} ${o.function.path}\`: ${o.reason}`,
                ),
              "",
            ];
          else if (h.type === "cancel")
            return [
              `### Cancel`,
              ...h.operations
                .filter((o) => o.protocol === "http")
                .map(
                  (o) =>
                    `  - \`${o.function.method.toUpperCase()} ${o.function.path}\`: ${o.reason}`,
                ),
              "",
            ];
          return [];
        })
        .flat(),
    ];
    for (const name of ["responses", "histories"])
      try {
        await fs.promises.mkdir(`${p.directory}/${name}`);
      } catch {}
    await Promise.all(
      p.trial.responses.map((r, i) =>
        fs.promises.writeFile(
          `${p.directory}/responses/${p.fileName}.response.${i}.json`,
          JSON.stringify(r, null, 2),
          "utf8",
        ),
      ),
    );
    await fs.promises.writeFile(
      `${p.directory}/histories/${p.fileName}.json`,
      JSON.stringify(p.trial.histories, null, 2),
      "utf8",
    );
    await fs.promises.writeFile(
      `${path.resolve(`${p.directory}/${p.fileName}`)}.md`,
      content.join("\n"),
      "utf8",
    );
  };

  const aggregateUsages = (
    usages: INestiaAgentTokenUsage[],
  ): INestiaAgentTokenUsage =>
    usages.reduce(
      (a, b) => ({
        total: a.total + b.total,
        prompt: {
          total: a.prompt.total + b.prompt.total,
          audio: a.prompt.audio + b.prompt.audio,
          cached: a.prompt.cached + b.prompt.cached,
        },
        completion: {
          total: a.completion.total + b.completion.total,
          accepted_prediction:
            a.completion.accepted_prediction + b.completion.accepted_prediction,
          audio: a.completion.audio + b.completion.audio,
          reasoning: a.completion.reasoning + b.completion.reasoning,
          rejected_prediction:
            a.completion.rejected_prediction + b.completion.rejected_prediction,
        },
      }),
      {
        total: 0,
        prompt: {
          total: 0,
          audio: 0,
          cached: 0,
        },
        completion: {
          total: 0,
          accepted_prediction: 0,
          audio: 0,
          reasoning: 0,
          rejected_prediction: 0,
        },
      },
    );

  const prepare = async (): Promise<void> => {
    const root: string = `${ShoppingConfiguration.ROOT}/docs/benchmarks/call`;
    if (fs.existsSync(root)) await fs.promises.rm(root, { recursive: true });
    await fs.promises.mkdir(root, { recursive: true });
  };
}

const LOCATION: string = `${ShoppingConfiguration.ROOT}/docs/benchmarks/call`;
