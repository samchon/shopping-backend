import { ShoppingConfiguration } from "../ShoppingConfiguration";
import { ShoppingGlobal } from "../ShoppingGlobal";
import ShoppingApi from "../api";
import { IPerformance } from "../api/structures/monitors/IPerformance";
import { ISystem } from "../api/structures/monitors/ISystem";

async function main(): Promise<void> {
  // CONFIGURE MODE
  if (process.argv[2])
    ShoppingGlobal.setMode(process.argv[2] as typeof ShoppingGlobal.mode);

  // GET PERFORMANCE & SYSTEM INFO
  const connection: ShoppingApi.IConnection = {
    host: `http://${ShoppingConfiguration.MASTER_IP()}:${ShoppingConfiguration.API_PORT()}`,
  };
  const performance: IPerformance =
    await ShoppingApi.functional.monitors.performance.get(connection);
  const system: ISystem = await ShoppingApi.functional.monitors.system.get(
    connection,
  );

  // TRACE THEM
  console.log({ performance, system });
}
main().catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
