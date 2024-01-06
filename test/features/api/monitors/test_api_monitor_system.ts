import typia from "typia";

import ShoppingApi from "@samchon/shopping-api";
import { ISystem } from "@samchon/shopping-api/lib/structures/monitors/ISystem";

import { ConnectionPool } from "../../../ConnectionPool";

export const test_api_monitor_system = async (
  pool: ConnectionPool,
): Promise<void> => {
  const system: ISystem = await ShoppingApi.functional.monitors.system.get(
    pool.generate(),
  );
  typia.assert(system);
};
