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

export const test_api_shopping_delivery_journey_erase = async (
  pool: ConnectionPool,
): Promise<void> => {
  const customer: IShoppingCustomer = await test_api_shopping_actor_customer_join(
    pool,
  );
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

  const delivery: IShoppingDelivery =
    await ShoppingApi.functional.shoppings.sellers.deliveries.create(
      pool.seller,
      {
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
      },
    );
  typia.assertEquals(delivery);

  await ShoppingApi.functional.shoppings.sellers.deliveries.journeys.erase(
    pool.seller,
    delivery.id,
    delivery.journeys[0].id,
  );

  const reloaded: IShoppingOrder =
    await ShoppingApi.functional.shoppings.sellers.orders.at(
      pool.seller,
      delivery.id,
    );
  typia.assertEquals(reloaded);
  TestValidator.equals("deleted_at")(
    !!reloaded.publish!.deliveries[0].journeys.at(-1)!.deleted_at,
  )(true);
  TestValidator.equals("state")(reloaded.publish!.state)("manufacturing");
};