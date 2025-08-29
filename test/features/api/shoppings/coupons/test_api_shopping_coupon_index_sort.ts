import {
  ArrayUtil,
  GaffComparator,
  RandomGenerator,
  TestValidator,
} from "@nestia/e2e";
import { randint } from "tstl";
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

export const test_api_shopping_coupon_index_sort = async (
  pool: ConnectionPool,
): Promise<void> => {
  // AUTHORIZE USERS
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_seller_join(pool);

  // GENERATE COUPONS
  const prefix: string = RandomGenerator.name(50);
  const saleList: IShoppingSale[] = await ArrayUtil.asyncRepeat(10, () =>
    generate_random_sale(pool),
  );
  const generator =
    (sale: IShoppingSale) => (types: IShoppingCouponCriteria.Type[]) =>
      generate_random_coupon({
        direction: "include",
        customer: null,
        sale,
        types,
        create: (input) =>
          ShoppingApi.functional.shoppings.admins.coupons.create(pool.admin, {
            ...input,
            name: `${prefix}-${RandomGenerator.name(10)}`,
          }),
        prepare: (criterias) =>
          prepare_random_coupon({
            criterias,
            opened_at: new Date(
              Date.now() + randint(-5 * DAY, 0),
            ).toISOString(),
            closed_at: new Date(
              Date.now() + randint(2 * DAY, 7 * DAY),
            ).toISOString(),
            restriction: {
              expired_at: null,
              expired_in: randint(7, 28),
            },
          }),
      });

  const coupons: IShoppingCoupon[] = (
    await ArrayUtil.asyncMap(saleList, (sale) =>
      ArrayUtil.asyncMap(
        typia.misc.literals<IShoppingCouponCriteria.Type>(),
        (type) => generator(sale)([type]),
      ),
    )
  ).flat();

  // PREPARE VALIDATOR
  const validator = TestValidator.sort<
    IShoppingCoupon,
    IShoppingCoupon.IRequest.SortableColumns,
    IPage.Sort<IShoppingCoupon.IRequest.SortableColumns>
  >("coupons.index with sort options", async (sort) => {
    const page: IPage<IShoppingCoupon> =
      await ShoppingApi.functional.shoppings.admins.coupons.index(pool.admin, {
        search: {
          name: prefix,
        },
        sort,
        limit: coupons.length,
      });
    return page.data;
  });

  // LIST UP FIELDS TO SORT
  const components = [
    // VALUES
    validator("coupon.name")(GaffComparator.strings((x) => x.name)),
    validator("coupon.value")(
      GaffComparator.numbers((x) => [x.discount.value]),
    ),
    validator("coupon.unit")(GaffComparator.strings((x) => [x.discount.unit])),

    // TIMESTAMPS
    validator("coupon.created_at")(GaffComparator.dates((x) => x.created_at)),
    validator("coupon.opened_at")(
      GaffComparator.strings((x) => x.opened_at ?? "2999-12-31"),
    ),
    validator("coupon.closed_at")(
      GaffComparator.strings((x) => x.closed_at ?? "2999-12-31"),
    ),
  ];

  // DO VALIDATE
  for (const comp of components) {
    await comp("+");
    await comp("-");
  }

  // ERASED COUPONS
  for (const c of coupons)
    await ShoppingApi.functional.shoppings.admins.coupons.destroy(
      pool.admin,
      c.id,
    );
};
const DAY = 1000 * 60 * 60 * 24;
