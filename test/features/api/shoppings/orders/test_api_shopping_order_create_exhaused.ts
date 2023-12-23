import { TestValidator } from "@nestia/e2e";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_sole_sale } from "../sales/internal/generate_random_sole_sale";
import { generate_random_order } from "./internal/generate_random_order";
import { generate_random_order_publish } from "./internal/generate_random_order_publish";

export const test_api_shopping_order_create_exhaused = async (
  pool: ConnectionPool,
): Promise<void> => {
  const customer: IShoppingCustomer =
    await test_api_shopping_actor_customer_join(pool);
  await test_api_shopping_actor_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sole_sale(
    pool,
    {
      nominal: 10_000,
      real: 10_000,
    },
    1,
  );
  const commodity: IShoppingCartCommodity =
    await generate_random_cart_commodity(pool, sale, { volume: 1 });
  const anotherCommodity: IShoppingCartCommodity =
    await generate_random_cart_commodity(pool, sale, { volume: 1 });

  const order: IShoppingOrder = await generate_random_order(pool, [commodity]);
  order.publish = await generate_random_order_publish(
    pool,
    customer,
    order,
    true,
  );
  await TestValidator.httpError("exhaused")(410)(() =>
    generate_random_order(pool, [anotherCommodity]),
  );
};
