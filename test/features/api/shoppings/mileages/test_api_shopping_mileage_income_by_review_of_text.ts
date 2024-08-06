import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMileage } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileage";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderGood } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderGood";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_order } from "../orders/internal/generate_random_order";
import { generate_random_order_publish } from "../orders/internal/generate_random_order_publish";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_sale_review } from "../sales/internal/generate_random_sale_review";

export const test_api_shopping_mileage_income_by_review_of_text = async (
  pool: ConnectionPool
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_seller_join(pool);
  const customer: IShoppingCustomer =
    await test_api_shopping_actor_customer_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  const commodity: IShoppingCartCommodity =
    await generate_random_cart_commodity(pool, sale);
  const order: IShoppingOrder = await generate_random_order(pool, [commodity]);
  order.publish = await generate_random_order_publish(
    pool,
    customer,
    order,
    true
  );

  const good: IShoppingOrderGood = order.goods[0];
  await generate_random_sale_review(pool, sale, good, {
    files: [],
  });

  const mileage: IShoppingMileage =
    await ShoppingApi.functional.shoppings.admins.mileages.get(
      pool.admin,
      "shopping_sale_snapshot_review_text_reward"
    );
  const balance: number =
    await ShoppingApi.functional.shoppings.customers.mileages.histories.balance(
      pool.customer
    );
  TestValidator.equals("balance")(balance)(typia.assert<number>(mileage.value));
};
