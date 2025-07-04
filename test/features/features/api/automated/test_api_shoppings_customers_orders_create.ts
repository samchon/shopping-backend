import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingOrder } from "../../../../../src/api/structures/shoppings/orders/IShoppingOrder";

export const test_api_shoppings_customers_orders_create = async (
  connection: api.IConnection,
) => {
  const output: IShoppingOrder =
    await api.functional.shoppings.customers.orders.create(connection, {
      body: typia.random<IShoppingOrder.ICreate>(),
    });
  typia.assert(output);
};
