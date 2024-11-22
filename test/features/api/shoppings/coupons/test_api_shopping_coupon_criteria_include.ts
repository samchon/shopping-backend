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
import { generate_random_coupon } from "./internal/generate_random_coupon";
import { prepare_random_coupon } from "./internal/prepare_random_coupon";

export const test_api_shopping_coupon_criteria_include = async (
  pool: ConnectionPool
): Promise<void> => {
  // PREPARE ASSETS
  await test_api_shopping_actor_admin_login(pool);
  const outside: IGroup = await generate_group(pool, 0);
  const inside: IGroup = await generate_group(pool, 1);

  const erasure = (coupon: IShoppingCoupon) =>
    ShoppingApi.functional.shoppings.admins.coupons.destroy(
      pool.admin,
      coupon.id
    );

  // CREATE COUPONS FOR EACH CRITERIA AND VALIDATE THEM
  for (const type of typia.misc.literals<IShoppingCouponCriteria.Type>()) {
    const coupon: IShoppingCoupon = await generate_random_coupon({
      types: [type],
      direction: "include",
      customer: inside.customer,
      sale: inside.sale,
      create: (input) =>
        ShoppingApi.functional.shoppings.admins.coupons.create(
          pool.admin,
          input
        ),
      prepare: (criterias) => prepare_random_coupon({ criterias }),
    });

    const error: Error | null = await TestValidator.proceed(async () => {
      await validate(pool, inside, true);
      await validate(pool, outside, false);
    });
    await erasure(coupon);
    if (error) throw error;
  }
};

const validate = async (
  pool: ConnectionPool,
  { customer, sale }: IGroup,
  possible: boolean
): Promise<void> => {
  // CUSTOMER CAME BACK
  Object.assign(pool.customer.headers!, customer.setHeaders);

  try {
    sale = await ShoppingApi.functional.shoppings.customers.sales.at(
      pool.customer,
      sale.id
    );
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
      {
        commodity_ids: [commodity.id],
        pseudos: [],
      }
    );
  TestValidator.equals("predicate on cart")(possible)(
    !!preview.combinations.length
  );

  // PURCHASE THE SALE
  const order: IShoppingOrder = await generate_random_order(pool, [commodity]);

  // VALIDATE AGAIN THROUGH ORDER-DISCOUNTABLE
  const discountable: IShoppingOrderDiscountable =
    await ShoppingApi.functional.shoppings.customers.orders.discountable(
      pool.customer,
      order.id,
      {
        good_ids: null,
      }
    );
  TestValidator.equals("predicate on order")(possible)(
    !!discountable.combinations.length
  );
};

const generate_group = async (
  pool: ConnectionPool,
  i: number
): Promise<IGroup> => {
  // CREATE NEW CHANNEL AND SECTION
  const channel: IShoppingChannel =
    await ShoppingApi.functional.shoppings.admins.systematic.channels.create(
      pool.admin,
      {
        name: RandomGenerator.name(),
        code: RandomGenerator.alphabets(16),
      }
    );
  const section: IShoppingSection =
    await ShoppingApi.functional.shoppings.admins.systematic.sections.create(
      pool.admin,
      {
        name: RandomGenerator.name(),
        code: RandomGenerator.alphabets(16),
      }
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
      }
    );

  const activated: IShoppingCustomer =
    await ShoppingApi.functional.shoppings.customers.authenticate.activate(
      pool.customer,
      {
        mobile: RandomGenerator.mobile(),
        name: RandomGenerator.name(),
      }
    );
  customer.citizen = activated.citizen;

  // A NEW SALE WITH NEW SELLER
  await test_api_shopping_actor_seller_join(pool);
  const sale: IShoppingSale = await generate_random_sale(pool, {
    section_code: section.code,
    channels: [
      {
        code: channel.code,
        category_codes: [],
      },
    ],
  });
  return { customer, sale };
};

interface IGroup {
  customer: IShoppingCustomer.IAuthorized;
  sale: IShoppingSale;
}
