import typia from "typia";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingCartCommodity } from "../../../../../src/api/structures/shoppings/orders/IShoppingCartCommodity";

export const test_api_shoppings_customers_carts_commodities_index = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingCartCommodity> =
    await api.functional.shoppings.customers.carts.commodities.index(
      connection,
      {
        body: typia.random<IShoppingCartCommodity.IRequest>(),
      },
    );
  typia.assert(output);
};
