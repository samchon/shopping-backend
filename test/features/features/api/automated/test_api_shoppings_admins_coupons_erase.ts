import typia from "typia";

import api from "../../../../../src/api";

export const test_api_shoppings_admins_coupons_erase = async (
  connection: api.IConnection,
) => {
  const output = await api.functional.shoppings.admins.coupons.erase(
    connection,
    {
      id: typia.random<string>(),
    },
  );
  typia.assert(output);
};
