import ShoppingApi from "@samchon/shopping-api";

import { ConnectionPool } from "../../../ConnectionPool";

export const test_api_monitor_health_check = async (
    pool: ConnectionPool,
): Promise<void> => {
    await ShoppingApi.functional.monitors.health.get(pool.generate());
};
