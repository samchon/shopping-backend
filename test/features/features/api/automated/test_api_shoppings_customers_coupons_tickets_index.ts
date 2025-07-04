import typia from "typia";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingCouponTicket } from "../../../../../src/api/structures/shoppings/coupons/IShoppingCouponTicket";

export const test_api_shoppings_customers_coupons_tickets_index = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingCouponTicket> =
    await api.functional.shoppings.customers.coupons.tickets.index(connection, {
      body: typia.random<IShoppingCouponTicket.IRequest>(),
    });
  typia.assert(output);
};
