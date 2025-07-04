import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingMileageHistory } from "../../../../../src/api/structures/shoppings/mileages/IShoppingMileageHistory";

export const test_api_shoppings_customers_mileages_histories_at = async (
  connection: api.IConnection,
) => {
  const output: IShoppingMileageHistory =
    await api.functional.shoppings.customers.mileages.histories.at(connection, {
      id: typia.random<string & Format<"uuid">>(),
    });
  typia.assert(output);
};
