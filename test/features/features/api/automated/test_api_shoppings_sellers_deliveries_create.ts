import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingDelivery } from "../../../../../src/api/structures/shoppings/orders/IShoppingDelivery";

export const test_api_shoppings_sellers_deliveries_create = async (
  connection: api.IConnection,
) => {
  const output: IShoppingDelivery =
    await api.functional.shoppings.sellers.deliveries.create(connection, {
      body: typia.random<IShoppingDelivery.ICreate>(),
    });
  typia.assert(output);
};
