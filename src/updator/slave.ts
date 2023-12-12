import { ShoppingConfiguration } from "../ShoppingConfiguration";
import { ShoppingGlobal } from "../ShoppingGlobal";
import { start_updator_slave } from "./internal/start_updator_slave";

async function main(): Promise<void> {
  // CONFIGURE MODE
  if (process.argv[2])
    ShoppingGlobal.setMode(process.argv[2] as typeof ShoppingGlobal.mode);

  // START THE CLIENT
  await start_updator_slave(ShoppingConfiguration.MASTER_IP());
}
main().catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
