import typia from "typia";

import api from "../../../../../src/api";

export const test_api_shoppings_sellers_coupons_erase = async (
  connection: api.IConnection,
) => {
  const output = await api.functional.shoppings.sellers.coupons.erase(
    connection,
    {
      id: typia.random<string>(),
    },
  );
  typia.assert(output);
};
