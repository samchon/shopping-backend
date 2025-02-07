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

export const test_api_shopping_coupon_create = async (pool: ConnectionPool) => {
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_seller_join(pool);

  const prefix: string = RandomGenerator.name(50);
  const sale: IShoppingSale = await generate_random_sale(pool);
  const coupons: IShoppingCoupon[] = (
    await ArrayUtil.asyncMap(
      ArrayUtil.subsets(
        typia.misc
          .literals<IShoppingCouponCriteria.Type>()
          .filter((row) => row.length !== 0),
      ),
    )((types) =>
      ArrayUtil.asyncMap(["include", "exclude"] as const)((direction) =>
        generate_random_coupon({
          types,
          direction,
          customer: null,
          sale,
          create: (input) =>
            ShoppingApi.functional.shoppings.admins.coupons.create(pool.admin, {
              ...input,
              name: `${prefix}-${RandomGenerator.name(10)}`,
            }),
          prepare: (criterias) => prepare_random_coupon({ criterias }),
        }),
      ),
    )
  ).flat();

  const page: IPage<IShoppingCoupon> =
    await ShoppingApi.functional.shoppings.admins.coupons.index(pool.admin, {
      search: {
        name: prefix,
      },
      sort: ["-coupon.created_at"],
      limit: coupons.length,
    });
  TestValidator.equals("coupons")(coupons.map((c) => c.id))(
    page.data.reverse().map((c) => c.id),
  );
};
