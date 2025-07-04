import typia from "typia";

import api from "../../../../../src/api";

export const test_api_monitors_system_internal_server_error = async (
  connection: api.IConnection,
) => {
  const output =
    await api.functional.monitors.system.internal_server_error(connection);
  typia.assert(output);
};
