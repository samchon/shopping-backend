import typia from "typia";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingCoupon } from "../../../../../src/api/structures/shoppings/coupons/IShoppingCoupon";

export const test_api_shoppings_admins_coupons_index = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingCoupon> =
    await api.functional.shoppings.admins.coupons.index(connection, {
      body: typia.random<IShoppingCoupon.IRequest>(),
    });
  typia.assert(output);
};
