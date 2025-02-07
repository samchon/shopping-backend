import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingCouponCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponCriteria";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_coupon } from "./internal/generate_random_coupon";
import { prepare_random_coupon } from "./internal/prepare_random_coupon";

export const test_api_shopping_coupon_create_by_seller = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_seller_join(pool);

  const prefix: string = RandomGenerator.name(50);
  const sale: IShoppingSale = await generate_random_sale(pool);
  const create =
    (direction: "include" | "exclude") =>
    (types: IShoppingCouponCriteria.Type[]): Promise<IShoppingCoupon> =>
      generate_random_coupon({
        types,
        direction,
        customer: null,
        sale,
        create: (input) =>
          ShoppingApi.functional.shoppings.sellers.coupons.create(
            pool.seller,
            input,
          ),
        prepare: (criterias) =>
          prepare_random_coupon({
            name: `${prefix}-${RandomGenerator.name(10)}`,
            criterias,
          }),
      });

  // PREPARE COMBINATIONS
  const subsets: IShoppingCouponCriteria.Type[][] = ArrayUtil.subsets(
    typia.misc
      .literals<IShoppingCouponCriteria.Type>()
      .filter((row) => row.length !== 0),
  );
  const possible: IShoppingCouponCriteria.Type[][] = subsets.filter((row) =>
    row.some((type) => type === "sale" || type === "seller"),
  );
  const impossible: IShoppingCouponCriteria.Type[][] = subsets.filter((row) =>
    row.every((type) => type !== "sale" && type !== "seller"),
  );

  // TRY POSSIBLE
  const coupons: IShoppingCoupon[] = await ArrayUtil.asyncMap(possible)(
    create("include"),
  );
  const page: IPage<IShoppingCoupon> =
    await ShoppingApi.functional.shoppings.admins.coupons.index(pool.admin, {
      limit: coupons.length,
      search: {
        name: prefix,
      },
      sort: ["-coupon.created_at"],
    });
  TestValidator.equals("coupons")(coupons.map((c) => c.id))(
    page.data.reverse().map((c) => c.id),
  );
  await ArrayUtil.asyncMap(coupons)((c) =>
    ShoppingApi.functional.shoppings.admins.coupons.destroy(pool.admin, c.id),
  );

  // TRY IMPOSSIBLES
  await ArrayUtil.asyncMap(impossible)((types) =>
    TestValidator.httpError("include-but-omitted-essential")(403)(() =>
      create("include")(types),
    ),
  );
  await ArrayUtil.asyncMap(impossible)((types) =>
    TestValidator.httpError("exclude-every-essentials")(403)(() =>
      create("exclude")(types),
    ),
  );
};
