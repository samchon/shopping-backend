import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingCouponTicket } from "../../../../../src/api/structures/shoppings/coupons/IShoppingCouponTicket";

export const test_api_shoppings_customers_coupons_tickets_at = async (
  connection: api.IConnection,
) => {
  const output: IShoppingCouponTicket =
    await api.functional.shoppings.customers.coupons.tickets.at(connection, {
      id: typia.random<string & Format<"uuid">>(),
    });
  typia.assert(output);
};
