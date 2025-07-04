import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingMileage } from "../../../../../src/api/structures/shoppings/mileages/IShoppingMileage";

export const test_api_shoppings_admins_mileages_create = async (
  connection: api.IConnection,
) => {
  const output: IShoppingMileage =
    await api.functional.shoppings.admins.mileages.create(connection, {
      body: typia.random<IShoppingMileage.ICreate>(),
    });
  typia.assert(output);
};
