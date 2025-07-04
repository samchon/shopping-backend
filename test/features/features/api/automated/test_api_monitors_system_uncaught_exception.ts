import typia from "typia";

import api from "../../../../../src/api";

export const test_api_monitors_system_uncaught_exception = async (
  connection: api.IConnection,
) => {
  const output =
    await api.functional.monitors.system.uncaught_exception(connection);
  typia.assert(output);
};
