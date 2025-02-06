import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ActorPath } from "../../../../../src/typings/ActorPath";
import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_coupon } from "./internal/generate_random_coupon";
import { prepare_random_coupon } from "./internal/prepare_random_coupon";

export const test_api_shopping_coupon_exhausted = async (
  pool: ConnectionPool,
): Promise<void> => {
  // AUTHORIZE ACTORS
  const customer: IShoppingCustomer =
    await test_api_shopping_actor_customer_join(pool);
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_seller_join(pool);

  // GENERATE LIMITED COUPON
  const sale: IShoppingSale = await generate_random_sale(pool);
  const coupon: IShoppingCoupon = await generate_random_coupon({
    types: ["channel"],
    direction: "include",
    customer,
    sale,
    create: (input) =>
      ShoppingApi.functional.shoppings.admins.coupons.create(pool.admin, input),
    prepare: (criterias) =>
      prepare_random_coupon({
        criterias,
        name: RandomGenerator.name(64),
        restriction: {
          volume: 4,
          volume_per_citizen: null,
        },
      }),
  });

  // PREPARE VALIDATOR
  const validate = async (path: ActorPath, visible: boolean) => {
    const connection: ShoppingApi.IConnection =
      path === "admins"
        ? pool.admin
        : path === "customers"
          ? pool.customer
          : pool.seller;
    const page: IPage<IShoppingCoupon> = await ShoppingApi.functional.shoppings[
      path
    ].coupons.index(connection, {
      search: {
        name: coupon.name,
      },
      sort: ["-coupon.created_at"],
      limit: 1,
    });
    TestValidator.equals("visible")(visible)(coupon.id === page.data[0]?.id);
  };
  const ticketing = async () => {
    await ShoppingApi.functional.shoppings.customers.coupons.tickets.create(
      pool.customer,
      {
        coupon_id: coupon.id,
      },
    );
  };

  // NO PROBLEM
  await validate("admins", true);
  await validate("customers", true);
  await ArrayUtil.asyncRepeat(4)(ticketing);

  // EXHAUSTED
  await TestValidator.httpError("ticketing to exhausted")(410)(ticketing);
  await validate("admins", true);
  await validate("customers", false);
};
