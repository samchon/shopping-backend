import typia from "typia";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingCoupon } from "../../../../../src/api/structures/shoppings/coupons/IShoppingCoupon";

export const test_api_shoppings_sellers_coupons_index = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingCoupon> =
    await api.functional.shoppings.sellers.coupons.index(connection, {
      body: typia.random<IShoppingCoupon.IRequest>(),
    });
  typia.assert(output);
};
