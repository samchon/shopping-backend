import cp from "child_process";
import { sleep_for } from "tstl";

import { ShoppingConfiguration } from "../src/ShoppingConfiguration";
import { TestAutomation } from "./TestAutomation";

TestAutomation.execute({
  open: async () => {
    const backend: cp.ChildProcess = cp.fork("server.js", {
      cwd: `${ShoppingConfiguration.ROOT}/dist`,
    });
    await sleep_for(2_500);
    return backend;
  },
  close: async (backend) => {
    await backend.kill();
  },
}).catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
