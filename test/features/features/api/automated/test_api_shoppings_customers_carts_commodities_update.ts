import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingCartCommodity } from "../../../../../src/api/structures/shoppings/orders/IShoppingCartCommodity";

export const test_api_shoppings_customers_carts_commodities_update = async (
  connection: api.IConnection,
) => {
  const output =
    await api.functional.shoppings.customers.carts.commodities.update(
      connection,
      {
        id: typia.random<string & Format<"uuid">>(),
        body: typia.random<IShoppingCartCommodity.IUpdate>(),
      },
    );
  typia.assert(output);
};
