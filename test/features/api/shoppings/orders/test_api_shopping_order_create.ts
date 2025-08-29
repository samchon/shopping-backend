import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_customer_create } from "../actors/test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_order } from "./internal/generate_random_order";

export const test_api_shopping_order_create = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_customer_create(pool);
  await test_api_shopping_actor_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  const commodity: IShoppingCartCommodity =
    await generate_random_cart_commodity(pool, sale);
  const order: IShoppingOrder = await generate_random_order(pool, [commodity]);

  for (const actor of ["admin", "seller"] as const)
    await TestValidator.httpError("unpaid", 404, () =>
      ShoppingApi.functional.shoppings[`${actor}s`].orders.at(
        pool[actor],
        order.id,
      ),
    );

  const read: IShoppingOrder =
    await ShoppingApi.functional.shoppings.customers.orders.at(
      pool.customer,
      order.id,
    );
  TestValidator.equals("read", order, read);
};
