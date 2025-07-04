import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingDeliveryPiece } from "../../../../../src/api/structures/shoppings/orders/IShoppingDeliveryPiece";

export const test_api_shoppings_sellers_deliveries_incompletes = async (
  connection: api.IConnection,
) => {
  const output: Array<IShoppingDeliveryPiece.ICreate> =
    await api.functional.shoppings.sellers.deliveries.incompletes(connection, {
      body: typia.random<IShoppingDeliveryPiece.IRequest>(),
    });
  typia.assert(output);
};
