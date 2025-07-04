import typia from "typia";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingMileage } from "../../../../../src/api/structures/shoppings/mileages/IShoppingMileage";

export const test_api_shoppings_admins_mileages_index = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingMileage> =
    await api.functional.shoppings.admins.mileages.index(connection, {
      body: typia.random<IShoppingMileage.IRequest>(),
    });
  typia.assert(output);
};
