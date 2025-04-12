import { HttpLlm, ILlmApplication, OpenApi } from "@samchon/openapi";
import fs from "fs";

import { ShoppingConfiguration } from "../../src/ShoppingConfiguration";

const main = async (): Promise<void> => {
  const document: OpenApi.IDocument = OpenApi.convert(
    JSON.parse(
      await fs.promises.readFile(
        `${ShoppingConfiguration.ROOT}/packages/api/swagger.json`,
        "utf8",
      ),
    ),
  );
  const app: ILlmApplication<"chatgpt"> = HttpLlm.application({
    model: "chatgpt",
    document,
  });
  const lines: string[] = JSON.stringify(app, null, 2).split("\n");
  const newLines: string[] = lines.map((l) => l.split("\\n")).flat();
  console.log(newLines.length);
};
main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
