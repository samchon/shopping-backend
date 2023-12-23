import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingDelivery } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDelivery";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_order } from "../orders/internal/generate_random_order";
import { generate_random_order_publish } from "../orders/internal/generate_random_order_publish";
import { generate_random_sale } from "../sales/internal/generate_random_sale";

export const test_api_shopping_delivery_create = async (
  pool: ConnectionPool,
): Promise<void> => {
  const customer: IShoppingCustomer =
    await test_api_shopping_actor_customer_join(pool);
  await test_api_shopping_actor_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  const commodity: IShoppingCartCommodity =
    await generate_random_cart_commodity(pool, sale);
  const order: IShoppingOrder = await generate_random_order(pool, [commodity]);
  order.publish = await generate_random_order_publish(
    pool,
    customer,
    order,
    true,
  );

  const input: IShoppingDelivery.ICreate = {
    shippers: [],
    pieces: typia.assertEquals(
      await ShoppingApi.functional.shoppings.sellers.orders.incompletes(
        pool.seller,
        order.id,
      ),
    ),
    journeys: (["preparing", "manufacturing", "delivering"] as const).map(
      (type) => ({
        type,
        title: null,
        description: null,
        started_at: new Date().toISOString(),
        completed_at: null,
      }),
    ),
  };
  const delivery: IShoppingDelivery =
    await ShoppingApi.functional.shoppings.sellers.deliveries.create(
      pool.seller,
      input,
    );
  typia.assertEquals(delivery);
  TestValidator.equals("create")(input)(delivery);

  const read: IShoppingDelivery.IInvert =
    await ShoppingApi.functional.shoppings.sellers.deliveries.at(
      pool.seller,
      delivery.id,
    );
  typia.assertEquals(read);
  TestValidator.equals("read")(delivery)(read);
};
