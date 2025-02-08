import cp from "child_process";

import { ShoppingConfiguration } from "../src/ShoppingConfiguration";
import { ShoppingGlobal } from "../src/ShoppingGlobal";
import ShoppingApi from "../src/api";
import { TestAutomation } from "./TestAutomation";

const wait = async (): Promise<void> => {
  const connection: ShoppingApi.IConnection = {
    host: `http://localhost:${ShoppingConfiguration.API_PORT()}`,
  };
  while (true)
    try {
      await ShoppingApi.functional.monitors.health.get(connection);
      return;
    } catch {}
};

ShoppingGlobal.testing = true;
TestAutomation.execute({
  open: async () => {
    const backend: cp.ChildProcess = cp.fork("server.js", {
      cwd: `${ShoppingConfiguration.ROOT}/dist`,
    });
    await wait();
    return backend;
  },
  close: async (backend) => {
    await backend.kill();
  },
}).catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
