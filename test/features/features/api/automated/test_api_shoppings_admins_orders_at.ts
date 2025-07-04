import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingOrder } from "../../../../../src/api/structures/shoppings/orders/IShoppingOrder";

export const test_api_shoppings_admins_orders_at = async (
  connection: api.IConnection,
) => {
  const output: IShoppingOrder =
    await api.functional.shoppings.admins.orders.at(connection, {
      id: typia.random<string & Format<"uuid">>(),
    });
  typia.assert(output);
};
