import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingDeliveryJourney } from "../../../../../src/api/structures/shoppings/orders/IShoppingDeliveryJourney";

export const test_api_shoppings_sellers_deliveries_journeys_create = async (
  connection: api.IConnection,
) => {
  const output: IShoppingDeliveryJourney =
    await api.functional.shoppings.sellers.deliveries.journeys.create(
      connection,
      {
        deliveryId: typia.random<string & Format<"uuid">>(),
        body: typia.random<IShoppingDeliveryJourney.ICreate>(),
      },
    );
  typia.assert(output);
};
