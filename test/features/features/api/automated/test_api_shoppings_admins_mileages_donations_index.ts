import typia from "typia";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingMileageDonation } from "../../../../../src/api/structures/shoppings/mileages/IShoppingMileageDonation";

export const test_api_shoppings_admins_mileages_donations_index = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingMileageDonation> =
    await api.functional.shoppings.admins.mileages.donations.index(connection, {
      body: typia.random<IShoppingMileageDonation.IRequest>(),
    });
  typia.assert(output);
};
