import typia from "typia";

import api from "../../../../../src/api";

export const test_api_monitors_health_get = async (
  connection: api.IConnection,
) => {
  const output = await api.functional.monitors.health.get(connection);
  typia.assert(output);
};
