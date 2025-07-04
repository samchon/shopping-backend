import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";

export const test_api_shoppings_admins_mileages_erase = async (
  connection: api.IConnection,
) => {
  const output = await api.functional.shoppings.admins.mileages.erase(
    connection,
    {
      id: typia.random<string & Format<"uuid">>(),
    },
  );
  typia.assert(output);
};
