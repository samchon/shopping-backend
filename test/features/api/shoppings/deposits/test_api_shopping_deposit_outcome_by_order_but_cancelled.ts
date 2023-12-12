import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingDepositCharge } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositCharge";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderPrice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPrice";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_customer_join } from "../actors/test_api_shopping_customer_join";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_order } from "../orders/internal/generate_random_order";
import { generate_random_order_publish } from "../orders/internal/generate_random_order_publish";
import { generate_random_sole_sale } from "../sales/internal/generate_random_sole_sale";
import { generate_random_deposit_charge } from "./internal/generate_random_deposit_charge";
import { generate_random_deposit_charge_publish } from "./internal/generate_random_deposit_charge_publish";

export const test_api_shopping_deposit_outcome_by_order_but_cancelled = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_seller_join(pool);
  const customer: IShoppingCustomer = await test_api_shopping_customer_join(
    pool,
  );

  const charge: IShoppingDepositCharge = await generate_random_deposit_charge(
    pool,
    {
      value: 1_000,
    },
  );
  charge.publish = await generate_random_deposit_charge_publish(
    pool,
    charge,
    true,
  );
  await validateBalance(pool, charge.value);

  const sale: IShoppingSale = await generate_random_sole_sale(pool, {
    nominal: 10_000,
    real: 10_000,
  });
  const commodity: IShoppingCartCommodity =
    await generate_random_cart_commodity(pool, sale);

  const order: IShoppingOrder = await generate_random_order(pool, [commodity]);
  order.price = typia.assertEquals<IShoppingOrderPrice>(
    await ShoppingApi.functional.shoppings.customers.orders.discount(
      pool.customer,
      order.id,
      {
        deposit: charge.value,
        mileage: 0,
        coupon_ids: [],
      },
    ),
  );
  await validateBalance(pool, 0);

  order.publish = await generate_random_order_publish(
    pool,
    customer,
    order,
    false,
  );
  await ShoppingApi.functional.shoppings.customers.orders.publish.erase(
    pool.customer,
    order.id,
  );
  await validateBalance(pool, charge.value);
};

const validateBalance = async (
  pool: ConnectionPool,
  value: number,
): Promise<void> => {
  const balance: number =
    await ShoppingApi.functional.shoppings.customers.deposits.histories.balance(
      pool.customer,
    );
  TestValidator.equals("balance")(balance)(value);
};
