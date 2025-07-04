import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingOrderPublish } from "../../../../../src/api/structures/shoppings/orders/IShoppingOrderPublish";

export const test_api_shoppings_customers_orders_publish_create = async (
  connection: api.IConnection,
) => {
  const output: IShoppingOrderPublish =
    await api.functional.shoppings.customers.orders.publish.create(connection, {
      orderId: typia.random<string & Format<"uuid">>(),
      body: typia.random<IShoppingOrderPublish.ICreate>(),
    });
  typia.assert(output);
};
