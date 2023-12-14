import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingCartDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartDiscountable";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_admin_login } from "../actors/test_api_shopping_admin_login";
import { test_api_shopping_customer_create } from "../actors/test_api_shopping_customer_create";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_coupon } from "../coupons/internal/generate_random_coupon";
import { prepare_random_coupon } from "../coupons/internal/prepare_random_coupon";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_cart_commodity } from "./internal/generate_random_cart_commodity";

export const test_api_shopping_cart_discountable_multiplicative = async (
  pool: ConnectionPool,
) => {
  await test_api_shopping_admin_login(pool);
  await test_api_shopping_customer_create(pool);
  await test_api_shopping_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  const commodity: IShoppingCartCommodity =
    await generate_random_cart_commodity(pool, sale, {
      volume: 10,
    });
  const coupon: IShoppingCoupon = await generate_random_coupon({
    types: [],
    direction: "include",
    customer: null,
    sale,
    prepare: (criterias) =>
      prepare_random_coupon({
        criterias,
        restriction: {
          access: "public",
          volume: null,
          volume_per_citizen: null,
        },
        discount: {
          unit: "amount",
          value: 1234,
          threshold: null,
          multiplicative: true,
        },
      }),
    create: (input) =>
      ShoppingApi.functional.shoppings.admins.coupons.create(pool.admin, input),
  });

  const discountable: IShoppingCartDiscountable =
    await ShoppingApi.functional.shoppings.customers.carts.commodities.discountable(
      pool.customer,
      null,
      {
        commodity_ids: [commodity.id],
        pseudos: [],
      },
    );
  typia.assertEquals(discountable);

  const error: Error | null = TestValidator.proceed(() => {
    TestValidator.equals("discountable.combinations[].amount")(
      discountable.combinations.map((comb) => comb.amount),
    )([12340]);
  });
  await ShoppingApi.functional.shoppings.admins.coupons.destroy(
    pool.admin,
    coupon.id,
  );
  if (error) throw error;
};
