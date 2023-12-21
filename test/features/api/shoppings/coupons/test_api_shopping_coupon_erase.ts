import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingCouponTicket } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponTicket";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_coupon } from "./internal/generate_random_coupon";
import { prepare_random_coupon } from "./internal/prepare_random_coupon";

export const test_api_shopping_coupon_erase = async (
  pool: ConnectionPool,
): Promise<void> => {
  // AUTHORIZE ACTORS
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_customer_join(pool);
  await test_api_shopping_actor_seller_join(pool);

  // CREATE COUPON AND TICKET
  const sale: IShoppingSale = await generate_random_sale(pool);
  const coupon: IShoppingCoupon = await generate_random_coupon({
    types: [],
    direction: "include",
    customer: null,
    sale,
    create: (input) =>
      ShoppingApi.functional.shoppings.admins.coupons.create(pool.admin, input),
    prepare: (criterias) =>
      prepare_random_coupon({
        ...criterias,
        opened_at: new Date().toISOString(),
      }),
  });
  const ticket: IShoppingCouponTicket =
    await ShoppingApi.functional.shoppings.customers.coupons.tickets.create(
      pool.customer,
      {
        coupon_id: coupon.id,
      },
    );
  typia.assertEquals(ticket);

  // ERASE THE COUPON
  await ShoppingApi.functional.shoppings.admins.coupons.erase(
    pool.admin,
    coupon.id,
  );
  await TestValidator.httpError("erased")(404)(() =>
    ShoppingApi.functional.shoppings.customers.coupons.at(
      pool.admin,
      coupon.id,
    ),
  );

  // BUT TICKET STILL ALIVE
  const ticketReloading: IShoppingCouponTicket =
    await ShoppingApi.functional.shoppings.customers.coupons.tickets.at(
      pool.customer,
      ticket.id,
    );
  typia.assertEquals(ticketReloading);
};
