import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingDepositCharge } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositCharge";
import { IShoppingMileageDonation } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileageDonation";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderPrice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPrice";
import { IShoppingOrderPublish } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPublish";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { prepare_random_cart_commodity_stock } from "../carts/internal/prepare_random_cart_commodity_stock";
import { generate_random_coupon } from "../coupons/internal/generate_random_coupon";
import { prepare_random_coupon } from "../coupons/internal/prepare_random_coupon";
import { generate_random_deposit_charge } from "../deposits/internal/generate_random_deposit_charge";
import { generate_random_deposit_charge_publish } from "../deposits/internal/generate_random_deposit_charge_publish";
import { generate_random_mileage_donation } from "../mileages/internal/generate_random_mileage_donation";
import { generate_random_sole_sale } from "../sales/internal/generate_random_sole_sale";
import { generate_random_order } from "./internal/generate_random_order";
import { prepare_random_address } from "./internal/prepare_random_address";

export const test_api_shopping_order_publish_of_zero = async (
  pool: ConnectionPool,
): Promise<void> => {
  // AUTHORIZE ACTORS
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_seller_join(pool);
  const customer: IShoppingCustomer =
    await test_api_shopping_actor_customer_join(pool);

  // CREATE SALE TO ORDER
  const sale: IShoppingSale = await generate_random_sole_sale(pool, {
    nominal: 50_000,
    real: 40_000,
  });
  const commodity: IShoppingCartCommodity =
    await generate_random_cart_commodity(pool, sale, {
      volume: 1,
      stocks: [
        prepare_random_cart_commodity_stock(sale.units[0], {
          quantity: 1,
        }),
      ],
    });
  const order: IShoppingOrder = await generate_random_order(
    pool,
    [commodity],
    () => 1,
  );

  // PREPARE DISCOUNT FEATURES
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
          unit: "percent",
          value: 50,
          threshold: null,
        },
      }),
    create: (input) =>
      ShoppingApi.functional.shoppings.admins.coupons.create(pool.admin, input),
  });
  const donation: IShoppingMileageDonation =
    await generate_random_mileage_donation(pool, customer.citizen!, {
      value: 10_000,
    });
  const charge: IShoppingDepositCharge = await generate_random_deposit_charge(
    pool,
    {
      value: 10_000,
    },
  );
  charge.publish = await generate_random_deposit_charge_publish(
    pool,
    charge,
    true,
  );

  // DO DISCOUNT
  const price: IShoppingOrderPrice =
    await ShoppingApi.functional.shoppings.customers.orders.discount(
      pool.customer,
      order.id,
      {
        coupon_ids: [coupon.id],
        deposit: charge.value,
        mileage: donation.value,
      },
    );
  TestValidator.equals("ticket")(price.ticket)(20_000);
  TestValidator.equals("deposit")(price.deposit)(10_000);
  TestValidator.equals("mileage")(price.mileage)(10_000);
  TestValidator.equals("cash")(price.cash)(0);

  // DO PUBLISH
  const publish: IShoppingOrderPublish =
    await ShoppingApi.functional.shoppings.customers.orders.publish.create(
      pool.customer,
      order.id,
      {
        type: "zero",
        address: prepare_random_address(customer.citizen!),
      },
    );
  TestValidator.equals("paid")(!!publish.paid_at)(true);
};
