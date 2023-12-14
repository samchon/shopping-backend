import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingCouponTicket } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponTicket";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_admin_login } from "../actors/test_api_shopping_admin_login";
import { test_api_shopping_customer_join } from "../actors/test_api_shopping_customer_join";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_coupon } from "./internal/generate_random_coupon";
import { prepare_random_coupon } from "./internal/prepare_random_coupon";

export const test_api_shopping_coupon_exhausted_for_citizen = async (
  pool: ConnectionPool,
): Promise<void> => {
  // AUTHORIZE ACTORS
  await test_api_shopping_admin_login(pool);
  await test_api_shopping_customer_join(pool);
  await test_api_shopping_seller_join(pool);

  // GENERATED LIMITED COUPON
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
        restriction: {
          volume: null,
          volume_per_citizen: 1,
        },
      }),
  });

  const ticketing = async () => {
    const ticket: IShoppingCouponTicket =
      await ShoppingApi.functional.shoppings.customers.coupons.tickets.create(
        pool.customer,
        {
          coupon_id: coupon.id,
        },
      );
    typia.assertEquals(ticket);
  };

  // EXHAUSED
  await ticketing();
  await TestValidator.httpError("ticketing to exhausted")(410)(ticketing);

  // NO PROBLEM WHEN IF NEW CITIZEN COMES
  await test_api_shopping_customer_join(pool);
  await ticketing();
};
