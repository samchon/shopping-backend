import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingMileageDonation } from "../../../../../src/api/structures/shoppings/mileages/IShoppingMileageDonation";

export const test_api_shoppings_admins_mileages_donations_at = async (
  connection: api.IConnection,
) => {
  const output: IShoppingMileageDonation =
    await api.functional.shoppings.admins.mileages.donations.at(connection, {
      id: typia.random<string & Format<"uuid">>(),
    });
  typia.assert(output);
};
