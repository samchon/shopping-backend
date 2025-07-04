import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingDeliveryShipper } from "../../../../../src/api/structures/shoppings/orders/IShoppingDeliveryShipper";

export const test_api_shoppings_sellers_deliveries_shippers_create = async (
  connection: api.IConnection,
) => {
  const output: IShoppingDeliveryShipper =
    await api.functional.shoppings.sellers.deliveries.shippers.create(
      connection,
      {
        deliveryId: typia.random<string & Format<"uuid">>(),
        body: typia.random<IShoppingDeliveryShipper.ICreate>(),
      },
    );
  typia.assert(output);
};
