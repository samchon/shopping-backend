import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingDelivery } from "../../../../../src/api/structures/shoppings/orders/IShoppingDelivery";

export const test_api_shoppings_sellers_deliveries_at = async (
  connection: api.IConnection,
) => {
  const output: IShoppingDelivery.IInvert =
    await api.functional.shoppings.sellers.deliveries.at(connection, {
      id: typia.random<string & Format<"uuid">>(),
    });
  typia.assert(output);
};
