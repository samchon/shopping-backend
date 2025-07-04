import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingMileage } from "../../../../../src/api/structures/shoppings/mileages/IShoppingMileage";

export const test_api_shoppings_admins_mileages_get = async (
  connection: api.IConnection,
) => {
  const output: IShoppingMileage =
    await api.functional.shoppings.admins.mileages.get(connection, {
      code: typia.random<string>(),
    });
  typia.assert(output);
};
