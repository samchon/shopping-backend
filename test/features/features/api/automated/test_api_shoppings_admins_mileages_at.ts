import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingMileage } from "../../../../../src/api/structures/shoppings/mileages/IShoppingMileage";

export const test_api_shoppings_admins_mileages_at = async (
  connection: api.IConnection,
) => {
  const output: IShoppingMileage =
    await api.functional.shoppings.admins.mileages.at(connection, {
      id: typia.random<string & Format<"uuid">>(),
    });
  typia.assert(output);
};
