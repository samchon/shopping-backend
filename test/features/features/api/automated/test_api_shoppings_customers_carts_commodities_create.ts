import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingCartCommodity } from "../../../../../src/api/structures/shoppings/orders/IShoppingCartCommodity";

export const test_api_shoppings_customers_carts_commodities_create = async (
  connection: api.IConnection,
) => {
  const output: IShoppingCartCommodity =
    await api.functional.shoppings.customers.carts.commodities.create(
      connection,
      {
        body: typia.random<IShoppingCartCommodity.ICreate>(),
      },
    );
  typia.assert(output);
};
