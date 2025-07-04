import typia from "typia";

import api from "../../../../../src/api";
import type { IPerformance } from "../../../../../src/api/structures/monitors/IPerformance";

export const test_api_monitors_performance_get = async (
  connection: api.IConnection,
) => {
  const output: IPerformance =
    await api.functional.monitors.performance.get(connection);
  typia.assert(output);
};
