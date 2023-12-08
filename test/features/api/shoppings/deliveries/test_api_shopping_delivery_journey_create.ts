import { ArrayUtil, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingDelivery } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDelivery";
import { IShoppingDeliveryJourney } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryJourney";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_customer_join } from "../actors/test_api_shopping_customer_join";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_order } from "../orders/internal/generate_random_order";
import { generate_random_order_publish } from "../orders/internal/generate_random_order_publish";
import { generate_random_sale } from "../sales/internal/generate_random_sale";

export const test_api_shopping_delivery_journey_create = async (
  pool: ConnectionPool,
): Promise<void> => {
  const customer: IShoppingCustomer = await test_api_shopping_customer_join(
    pool,
  );
  await test_api_shopping_seller_join(pool);

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
      },
    );
  typia.assertEquals(delivery);

  const inputList: IShoppingDeliveryJourney.ICreate[] = (
    ["preparing", "manufacturing", "delivering"] as const
  ).map((type) => ({
    type,
    title: null,
    description: null,
    started_at: new Date().toISOString(),
    completed_at: null,
  }));
  const journeys: IShoppingDeliveryJourney[] = await ArrayUtil.asyncMap(
    inputList,
  )((input) =>
    ShoppingApi.functional.shoppings.sellers.deliveries.journeys.create(
      pool.seller,
      delivery.id,
      input,
    ),
  );
  typia.assertEquals(journeys);
  TestValidator.equals("create")(inputList)(journeys);

  const reloaded: IShoppingOrder =
    await ShoppingApi.functional.shoppings.sellers.orders.at(
      pool.seller,
      delivery.id,
    );
  typia.assertEquals(reloaded);
  TestValidator.equals("journeys")(reloaded.publish!.deliveries[0].journeys)(
    journeys,
  );
};
