import ShoppingApi from "@samchon/shopping-api";

import { ConnectionPool } from "../../../ConnectionPool";

export const test_api_monitor_system = async (
  pool: ConnectionPool,
): Promise<void> => {
  await ShoppingApi.functional.monitors.system.get(pool.generate());
};
