import { RandomGenerator, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingCouponCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponCriteria";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingCartDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartDiscountable";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderDiscountable";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";
import { IShoppingSection } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingSection";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_order } from "../orders/internal/generate_random_order";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { prepare_random_coupon } from "./internal/prepare_random_coupon";
import { prepare_random_coupon_criteria } from "./internal/prepare_random_coupon_criteria";

export async function test_api_shopping_coupon_criteria_exclude(
  pool: ConnectionPool,
): Promise<void> {
  // PREPARE ASSETS
  await test_api_shopping_actor_admin_login(pool);

  const outside: IGroup = await generate_group(pool, 0);
  const inside: IGroup = await generate_group(pool, 1);

  const generator = async (
    criterias: IShoppingCouponCriteria.ICreate[],
  ): Promise<IShoppingCoupon> => {
    const coupon: IShoppingCoupon =
      await ShoppingApi.functional.shoppings.admins.coupons.create(
        pool.admin,
        prepare_random_coupon({ criterias }),
      );
    return typia.assertEquals(coupon);
  };
  const erasure = (coupon: IShoppingCoupon) =>
    ShoppingApi.functional.shoppings.admins.coupons.destroy(
      pool.admin,
      coupon.id,
    );

  for (const x of typia.misc.literals<IShoppingCouponCriteria.Type>()) {
    // VALIDATE EXCLUDE ONLY CASE
    const exclude: IShoppingCoupon = await generator([
      prepare_random_coupon_criteria({
        customer: inside.customer,
        sale: inside.sale,
        direction: "exclude",
        type: x,
      }),
    ]);
    const e1 = await TestValidator.proceed(async () => {
      await validate(pool, inside, false);
      await validate(pool, outside, true);
    });
    await erasure(exclude);
    if (e1) throw e1;

    // VALIDATE COMPOSITE CASE
    const composite: IShoppingCoupon = await generator(
      typia.misc
        .literals<IShoppingCouponCriteria.Type>()
        .filter((y) => x !== y)
        .map((y) =>
          prepare_random_coupon_criteria({
            customer: inside.customer,
            sale: inside.sale,
            direction: "include",
            type: y,
          }),
        ),
    );
    const error: Error | null = await TestValidator.proceed(async () => {
      await validate(pool, inside, true);
      await validate(pool, outside, false);
    });
    await erasure(composite);
    if (error) throw error;
  }
}

async function validate(
  pool: ConnectionPool,
  { customer, sale }: IGroup,
  possible: boolean,
): Promise<void> {
  // CUSTOMER CAME BACK
  Object.assign(pool.customer.headers!, customer.setHeaders);

  try {
    sale = await ShoppingApi.functional.shoppings.customers.sales.at(
      pool.customer,
      sale.id,
    );
    typia.assertEquals(sale);
  } catch {
    return;
  }

  // INSERT INTO A CART
  const commodity: IShoppingCartCommodity =
    await generate_random_cart_commodity(pool, sale);

  // VALIDATE THROUGH CART-DISCOUNTABLE
  const preview: IShoppingCartDiscountable =
    await ShoppingApi.functional.shoppings.customers.carts.commodities.discountable(
      pool.customer,
      null,
      {
        commodity_ids: [commodity.id],
        pseudos: [],
      },
    );
  typia.assertEquals(preview);
  TestValidator.equals("predicate on cart")(possible)(
    !!preview.combinations.length,
  );

  // PURCHASE THE SALE
  const order: IShoppingOrder = await generate_random_order(pool, [commodity]);

  // VALIDATE AGAIN THROUGH ORDER-DISCOUNTABLE
  const discountable: IShoppingOrderDiscountable =
    await ShoppingApi.functional.shoppings.customers.orders.discountable(
      pool.customer,
      order.id,
      { good_ids: null },
    );
  typia.assertEquals(discountable);
  TestValidator.equals("predicate on order")(possible)(
    !!discountable.combinations.length,
  );
}

async function generate_group(
  pool: ConnectionPool,
  i: number,
): Promise<IGroup> {
  // CREATE NEW CHANNEL AND SECTION
  const channel: IShoppingChannel =
    await ShoppingApi.functional.shoppings.admins.systematic.channels.create(
      pool.admin,
      {
        name: RandomGenerator.name(),
        code: RandomGenerator.alphabets(16),
        exclusive: true,
      },
    );
  const section: IShoppingSection =
    await ShoppingApi.functional.shoppings.admins.systematic.sections.create(
      pool.admin,
      {
        name: RandomGenerator.name(),
        code: RandomGenerator.alphabets(16),
      },
    );

  // A NEW CUSTOMER
  const customer: IShoppingCustomer.IAuthorized =
    await ShoppingApi.functional.shoppings.customers.authenticate.create(
      pool.customer,
      {
        href: i === 0 ? "https://github.com" : "https://www.npmjs.com",
        referrer: i === 0 ? "https://www.google.com" : "https://www.naver.com",
        channel_code: channel.code,
        external_user: null,
      },
    );
  typia.assertEquals([channel, section, customer] as const);

  const activated: IShoppingCustomer =
    await ShoppingApi.functional.shoppings.customers.authenticate.activate(
      pool.customer,
      {
        mobile: RandomGenerator.mobile(),
        name: RandomGenerator.name(),
      },
    );
  customer.citizen = activated.citizen;

  // A NEW SALE WITH NEW SELLER
  await test_api_shopping_actor_seller_join(pool);
  const sale: IShoppingSale = await generate_random_sale(pool, {
    section_code: section.code,
    channels: [
      {
        code: channel.code,
        category_ids: [],
      },
    ],
  });
  return { customer, sale };
}

interface IGroup {
  customer: IShoppingCustomer.IAuthorized;
  sale: IShoppingSale;
}