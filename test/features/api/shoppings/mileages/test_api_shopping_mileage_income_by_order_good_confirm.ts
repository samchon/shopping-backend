import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingDelivery } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDelivery";
import { IShoppingDeliveryPiece } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryPiece";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderGood } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderGood";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ShoppingConfiguration } from "../../../../../src/ShoppingConfiguration";
import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_customer_join } from "../actors/test_api_shopping_customer_join";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_order } from "../orders/internal/generate_random_order";
import { generate_random_order_publish } from "../orders/internal/generate_random_order_publish";
import { generate_random_sale } from "../sales/internal/generate_random_sale";

export const test_api_shopping_mileage_income_by_order_good_confirm = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_seller_join(pool);
  const customer: IShoppingCustomer = await test_api_shopping_customer_join(
    pool,
  );

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
        pieces: typia.assertEquals<IShoppingDeliveryPiece.ICreate[]>(
          await ShoppingApi.functional.shoppings.sellers.orders.incompletes(
            pool.seller,
            order.id,
          ),
        ),
        shippers: [],
        journeys: (
          ["preparing", "manufacturing", "shipping", "delivering"] as const
        ).map((type) => ({
          type,
          title: null,
          description: null,
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })),
      },
    );
  typia.assertEquals(delivery);

  const good: IShoppingOrderGood = order.goods[0];
  await ShoppingApi.functional.shoppings.customers.orders.goods.confirm(
    pool.customer,
    order.id,
    good.id,
  );

  const balance: number =
    await ShoppingApi.functional.shoppings.customers.mileages.histories.balance(
      pool.customer,
    );
  TestValidator.equals("balance")(balance)(
    (good.price.real *
      ShoppingConfiguration.MILEAGE_REWARDS.ORDER_GOOD_CONFIRM_PERCENTAGE) /
      100,
  );
};
