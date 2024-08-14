import { TestValidator } from "@nestia/e2e";
import { sleep_until } from "tstl";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
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

export const test_api_shopping_coupon_opened_at = async (
  pool: ConnectionPool,
): Promise<void> => {
  // AUTHORIZE ACTORS
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_customer_join(pool);
  await test_api_shopping_actor_seller_join(pool);

  // CREATE COUPON TO BE OPENED SOON
  const opened_at: Date = new Date(Date.now() + 3_000);
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
        opened_at: opened_at.toISOString(),
      }),
  });

  const error: Error | null = await TestValidator.proceed(async () => {
    // PREPARE VALIDATOR
    const validate = async (path: ActorPath, visible: boolean) => {
      const connection: ShoppingApi.IConnection =
        path === "admins"
          ? pool.admin
          : path === "customers"
            ? pool.customer
            : pool.seller;

      // VALIDATE INDEX
      const page: IPage<IShoppingCoupon> =
        await ShoppingApi.functional.shoppings[path].coupons.index(connection, {
          sort: ["-coupon.created_at"],
          limit: 1,
        });
      if (visible !== (coupon.id === page.data[0]?.id))
        console.log(path, visible, new Date(), coupon.opened_at);
      TestValidator.equals("visible")(visible)(coupon.id === page.data[0]?.id);

      // VALIDATE READ
      const read = async () => {
        await ShoppingApi.functional.shoppings[path].coupons.at(
          connection,
          coupon.id,
        );
      };
      if (visible) await read();
      else await TestValidator.httpError("gone")(422)(read);
    };

    // NOT YET
    await validate("admins", true);
    await validate("customers", false);

    // BUT SOON
    await sleep_until(opened_at);
    await validate("admins", true);
    await validate("customers", true);
  });

  await ShoppingApi.functional.shoppings.admins.coupons.destroy(
    pool.admin,
    coupon.id,
  );
  if (error) throw error;
};
