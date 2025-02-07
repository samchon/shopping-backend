import { ShoppingBackend } from "../src/ShoppingBackend";
import { TestAutomation } from "./TestAutomation";

TestAutomation.execute({
  open: async () => {
    const backend: ShoppingBackend = new ShoppingBackend();
    await backend.open();
    return backend;
  },
  close: async (backend) => {
    await backend.close();
  },
}).catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
