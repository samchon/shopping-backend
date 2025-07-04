import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";

export const test_api_shoppings_customers_orders_goods_confirm = async (
  connection: api.IConnection,
) => {
  const output = await api.functional.shoppings.customers.orders.goods.confirm(
    connection,
    {
      orderId: typia.random<string & Format<"uuid">>(),
      id: typia.random<string & Format<"uuid">>(),
    },
  );
  typia.assert(output);
};
