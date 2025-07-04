import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingCartCommodity } from "../../../../../src/api/structures/shoppings/orders/IShoppingCartCommodity";
import type { IShoppingOrder } from "../../../../../src/api/structures/shoppings/orders/IShoppingOrder";

export const test_api_shoppings_customers_orders_direct = async (
  connection: api.IConnection,
) => {
  const output: IShoppingOrder =
    await api.functional.shoppings.customers.orders.direct(connection, {
      body: typia.random<IShoppingCartCommodity.ICreate>(),
    });
  typia.assert(output);
};
