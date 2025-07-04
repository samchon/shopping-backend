import typia from "typia";

import api from "../../../../../src/api";
import type { ISystem } from "../../../../../src/api/structures/monitors/ISystem";

export const test_api_monitors_system_get = async (
  connection: api.IConnection,
) => {
  const output: ISystem = await api.functional.monitors.system.get(connection);
  typia.assert(output);
};
