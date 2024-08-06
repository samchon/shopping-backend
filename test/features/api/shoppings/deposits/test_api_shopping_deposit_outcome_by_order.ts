import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingDepositCharge } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositCharge";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_order } from "../orders/internal/generate_random_order";
import { generate_random_sole_sale } from "../sales/internal/generate_random_sole_sale";
import { generate_random_deposit_charge } from "./internal/generate_random_deposit_charge";
import { generate_random_deposit_charge_publish } from "./internal/generate_random_deposit_charge_publish";

export const test_api_shopping_deposit_outcome_by_order = async (
  pool: ConnectionPool
): Promise<void> => {
  await test_api_shopping_actor_seller_join(pool);
  await test_api_shopping_actor_customer_join(pool);

  const charge: IShoppingDepositCharge = await generate_random_deposit_charge(
    pool,
    {
      value: 1_000,
    }
  );
  charge.publish = await generate_random_deposit_charge_publish(
    pool,
    charge,
    true
  );

  const sale: IShoppingSale = await generate_random_sole_sale(pool, {
    nominal: 10_000,
    real: 10_000,
  });
  const commodity: IShoppingCartCommodity =
    await generate_random_cart_commodity(pool, sale);
  const order: IShoppingOrder = await generate_random_order(pool, [commodity]);
  order.price =
    await ShoppingApi.functional.shoppings.customers.orders.discount(
      pool.customer,
      order.id,
      {
        deposit: charge.value,
        mileage: 0,
        coupon_ids: [],
      }
    );

  const balance: number =
    await ShoppingApi.functional.shoppings.customers.deposits.histories.balance(
      pool.customer
    );
  TestValidator.equals("balance")(balance)(0);
};
