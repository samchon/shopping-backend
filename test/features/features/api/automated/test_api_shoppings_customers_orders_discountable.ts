import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingOrderDiscountable } from "../../../../../src/api/structures/shoppings/orders/IShoppingOrderDiscountable";

export const test_api_shoppings_customers_orders_discountable = async (
  connection: api.IConnection,
) => {
  const output: IShoppingOrderDiscountable =
    await api.functional.shoppings.customers.orders.discountable(connection, {
      id: typia.random<string & Format<"uuid">>(),
      body: typia.random<IShoppingOrderDiscountable.IRequest>(),
    });
  typia.assert(output);
};
