import typia from "typia";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingOrder } from "../../../../../src/api/structures/shoppings/orders/IShoppingOrder";

export const test_api_shoppings_sellers_orders_index = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingOrder> =
    await api.functional.shoppings.sellers.orders.index(connection, {
      body: typia.random<IShoppingOrder.IRequest>(),
    });
  typia.assert(output);
};
