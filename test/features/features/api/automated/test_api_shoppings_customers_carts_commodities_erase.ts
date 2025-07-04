import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";

export const test_api_shoppings_customers_carts_commodities_erase = async (
  connection: api.IConnection,
) => {
  const output =
    await api.functional.shoppings.customers.carts.commodities.erase(
      connection,
      {
        id: typia.random<string & Format<"uuid">>(),
      },
    );
  typia.assert(output);
};
