import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingCouponTicket } from "../../../../../src/api/structures/shoppings/coupons/IShoppingCouponTicket";

export const test_api_shoppings_customers_coupons_tickets_create = async (
  connection: api.IConnection,
) => {
  const output: IShoppingCouponTicket =
    await api.functional.shoppings.customers.coupons.tickets.create(
      connection,
      {
        body: typia.random<IShoppingCouponTicket.ICreate>(),
      },
    );
  typia.assert(output);
};
