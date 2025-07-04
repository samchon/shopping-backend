import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingCoupon } from "../../../../../src/api/structures/shoppings/coupons/IShoppingCoupon";

export const test_api_shoppings_sellers_coupons_at = async (
  connection: api.IConnection,
) => {
  const output: IShoppingCoupon =
    await api.functional.shoppings.sellers.coupons.at(connection, {
      id: typia.random<string>(),
    });
  typia.assert(output);
};
