import typia from "typia";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingDelivery } from "../../../../../src/api/structures/shoppings/orders/IShoppingDelivery";

export const test_api_shoppings_sellers_deliveries_index = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingDelivery.IInvert> =
    await api.functional.shoppings.sellers.deliveries.index(connection, {
      body: typia.random<IShoppingDelivery.IRequest>(),
    });
  typia.assert(output);
};
