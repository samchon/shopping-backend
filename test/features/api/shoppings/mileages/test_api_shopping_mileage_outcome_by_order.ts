import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMileageDonation } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileageDonation";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderPrice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPrice";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_order } from "../orders/internal/generate_random_order";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_mileage_donation } from "./internal/generate_random_mileage_donation";

export const test_api_shopping_mileage_outcome_by_order = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_seller_join(pool);
  const customer: IShoppingCustomer = await test_api_shopping_actor_customer_join(
    pool,
  );

  const sale: IShoppingSale = await generate_random_sale(pool);
  const commodity: IShoppingCartCommodity =
    await generate_random_cart_commodity(pool, sale);
  const order: IShoppingOrder = await generate_random_order(pool, [commodity]);

  const donation: IShoppingMileageDonation =
    await generate_random_mileage_donation(pool, customer.citizen!, {
      value: 1_000,
    });
  await validateBalance(pool, donation.value);

  const price: IShoppingOrderPrice =
    await ShoppingApi.functional.shoppings.customers.orders.discount(
      pool.customer,
      order.id,
      {
        mileage: donation.value,
        deposit: 0,
        coupon_ids: [],
      },
    );
  typia.assertEquals(price);
  await validateBalance(pool, 0);
};

const validateBalance = async (
  pool: ConnectionPool,
  value: number,
): Promise<void> => {
  const balance: number =
    await ShoppingApi.functional.shoppings.customers.mileages.histories.balance(
      pool.customer,
    );
  TestValidator.equals("balance")(balance)(value);
};
