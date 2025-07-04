import typia from "typia";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingMileageHistory } from "../../../../../src/api/structures/shoppings/mileages/IShoppingMileageHistory";

export const test_api_shoppings_customers_mileages_histories_index = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingMileageHistory> =
    await api.functional.shoppings.customers.mileages.histories.index(
      connection,
      {
        body: typia.random<IShoppingMileageHistory.IRequest>(),
      },
    );
  typia.assert(output);
};
