import { ArrayUtil, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingCouponCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponCriteria";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderDiscountable";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSection } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingSection";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_customer_join } from "../../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../../actors/test_api_shopping_actor_seller_join";
import { generate_random_cart_commodity } from "../../carts/internal/generate_random_cart_commodity";
import { prepare_random_coupon } from "../../coupons/internal/prepare_random_coupon";
import { generate_random_sole_sale } from "../../sales/internal/generate_random_sole_sale";
import { generate_random_section } from "../../systematic/internal/generate_random_section";
import { generate_random_order } from "./generate_random_order";

export const validate_api_shopping_order_discountable =
  (
    next?: (
      pool: ConnectionPool,
      props: validate_api_shopping_order_discountable.IProps,
    ) => Promise<any>,
  ) =>
  async (pool: ConnectionPool): Promise<void> => {
    //----
    // PRELIMINIARIES
    //----
    // ACTORS
    const customer: IShoppingCustomer =
      await test_api_shopping_actor_customer_join(pool);
    await test_api_shopping_actor_admin_login(pool);
    await test_api_shopping_actor_seller_join(pool);

    // SALES TO ORDER
    const saleList: IShoppingSale[] = await ArrayUtil.asyncRepeat(3)(() =>
      generate_random_sole_sale(pool, {
        nominal: 50_000,
        real: 50_000,
      }),
    );
    const commodities: IShoppingCartCommodity[] = await ArrayUtil.asyncMap(
      saleList,
    )((sale) => generate_random_cart_commodity(pool, sale));
    const order: IShoppingOrder = await generate_random_order(
      pool,
      commodities,
      () => 1,
    );

    //----
    // GENERATE COUPONS
    //----
    const dummySection: IShoppingSection = await generate_random_section(pool);
    const dummySeller: IShoppingSeller =
      await test_api_shopping_actor_seller_join(pool);
    const generator =
      (exclusive: boolean) =>
      async (
        criteria: IShoppingCouponCriteria.ICreate,
      ): Promise<IShoppingCoupon> => {
        const coupon: IShoppingCoupon =
          await ShoppingApi.functional.shoppings.admins.coupons.create(
            pool.admin,
            prepare_random_coupon({
              restriction: {
                exclusive,
                volume: null,
                volume_per_citizen: null,
              },
              discount: {
                unit: "amount",
                value: 5_000,
                multiplicative: false,
                threshold: null,
              },
              criterias: [criteria],
            }),
          );
        return typia.assertEquals(coupon);
      };

    const couponList: IShoppingCoupon[] = [
      // DISCOUNTABLE
      await generator(true)({
        type: "channel",
        direction: "include",
        channels: [
          {
            channel_code: saleList[0].channels[0].code,
            category_ids: null,
          },
        ],
      }),
      await generator(false)({
        type: "sale",
        direction: "include",
        sale_ids: [saleList[0].id],
      }),
      await generator(false)({
        type: "seller",
        direction: "include",
        seller_ids: [saleList[0].seller.id],
      }),
      await generator(false)({
        type: "section",
        direction: "include",
        section_codes: [saleList[0].section.code],
      }),
      // OUT-OF-DISCOUNTABLE
      await generator(true)({
        type: "section",
        direction: "include",
        section_codes: [dummySection.code],
      }),
      await generator(true)({
        type: "seller",
        direction: "include",
        seller_ids: [dummySeller.id],
      }),
    ];

    //----
    // VALIDATE
    //----
    // GET DISCOUNTABLE INFO
    const discountable: IShoppingOrderDiscountable =
      await ShoppingApi.functional.shoppings.customers.orders.discountable(
        pool.customer,
        order.id,
        {
          good_ids: order.goods.map((g) => g.id),
        },
      );
    typia.assertEquals(discountable);

    const error: Error | null = await TestValidator.proceed(async () => {
      // VALIDATE COMBINATIONS
      TestValidator.equals("combinations.length")(
        discountable.combinations.length,
      )(2);
      TestValidator.equals("combinations[].amount")(
        discountable.combinations.map((comb) => comb.amount),
      )([15_000, 5_000]);
      TestValidator.equals("combinations[].coupons.length")(
        discountable.combinations.map((comb) => comb.coupons.length),
      )([3, 1]);

      // FOR THE NEXT STEP
      if (next)
        await next(pool, {
          customer,
          sales: saleList,
          order,
          discountable,
          coupons: couponList,
          generator,
        });
    });

    // CLEAN UP COUPONS
    for (const coupon of couponList)
      await ShoppingApi.functional.shoppings.admins.coupons.destroy(
        pool.admin,
        coupon.id,
      );
    await ShoppingApi.functional.shoppings.admins.systematic.sections.merge(
      pool.admin,
      {
        keep: saleList[0].section.id,
        absorbed: [dummySection.id],
      },
    );

    // TERMINATE
    if (error) throw error;
  };
export namespace validate_api_shopping_order_discountable {
  export interface IProps {
    customer: IShoppingCustomer;
    sales: IShoppingSale[];
    order: IShoppingOrder;
    discountable: IShoppingOrderDiscountable;
    coupons: IShoppingCoupon[];
    generator: (
      exclusive: boolean,
    ) => (
      criteria: IShoppingCouponCriteria.ICreate,
    ) => Promise<IShoppingCoupon>;
  }
}
