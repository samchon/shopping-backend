import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingOrderPrice } from "../../../../../src/api/structures/shoppings/orders/IShoppingOrderPrice";

export const test_api_shoppings_customers_orders_price = async (
  connection: api.IConnection,
) => {
  const output: IShoppingOrderPrice =
    await api.functional.shoppings.customers.orders.price(connection, {
      id: typia.random<string & Format<"uuid">>(),
    });
  typia.assert(output);
};
