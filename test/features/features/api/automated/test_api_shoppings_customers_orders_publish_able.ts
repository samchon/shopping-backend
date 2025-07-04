import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";

export const test_api_shoppings_customers_orders_publish_able = async (
  connection: api.IConnection,
) => {
  const output: false | true =
    await api.functional.shoppings.customers.orders.publish.able(connection, {
      orderId: typia.random<string & Format<"uuid">>(),
    });
  typia.assert(output);
};
