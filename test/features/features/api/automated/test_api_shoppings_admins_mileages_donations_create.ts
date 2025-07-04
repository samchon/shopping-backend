import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingMileageDonation } from "../../../../../src/api/structures/shoppings/mileages/IShoppingMileageDonation";

export const test_api_shoppings_admins_mileages_donations_create = async (
  connection: api.IConnection,
) => {
  const output: IShoppingMileageDonation =
    await api.functional.shoppings.admins.mileages.donations.create(
      connection,
      {
        body: typia.random<IShoppingMileageDonation.ICreate>(),
      },
    );
  typia.assert(output);
};
