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
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { prepare_random_cart_commodity_stock } from "../carts/internal/prepare_random_cart_commodity_stock";
import { generate_random_order } from "../orders/internal/generate_random_order";
import { generate_random_order_publish } from "../orders/internal/generate_random_order_publish";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { prepare_random_sale_unit } from "../sales/internal/prepare_random_sale_unit";

export const test_api_shopping_delivery_state = async (
  pool: ConnectionPool,
): Promise<void> => {
  const customer: IShoppingCustomer =
    await test_api_shopping_actor_customer_join(pool);
  await test_api_shopping_actor_seller_join(pool);

  const saleList: IShoppingSale[] = await ArrayUtil.asyncRepeat(REPEAT)(
    async () =>
      await generate_random_sale(pool, {
        units: new Array(REPEAT).fill(0).map(() => prepare_random_sale_unit()),
      }),
  );
  const commodities: IShoppingCartCommodity[] = await ArrayUtil.asyncMap(
    saleList,
  )((sale) =>
    generate_random_cart_commodity(pool, sale, {
      volume: REPEAT / 2,
      stocks: sale.units.map((unit) =>
        prepare_random_cart_commodity_stock(unit, { quantity: REPEAT / 2 }),
      ),
    }),
  );
  const order: IShoppingOrder = await generate_random_order(pool, commodities);
  order.publish = await generate_random_order_publish(
    pool,
    customer,
    order,
    true,
  );

  const validate = async (states: IShoppingDelivery.State[]) => {
    const read: IShoppingOrder =
      await ShoppingApi.functional.shoppings.customers.orders.at(
        pool.customer,
        order.id,
      );
    typia.assertEquals(read);
    TestValidator.equals("states")([
      read.publish!.state,
      read.goods.map((g) => g.state!),
    ])(states);
  };
  await validate(["none", "none", "none"]);

  const deliveries: IShoppingDelivery[] = await ArrayUtil.asyncRepeat(
    REPEAT * REPEAT,
  )(async (i) => {
    const delivery: IShoppingDelivery =
      await ShoppingApi.functional.shoppings.sellers.deliveries.create(
        pool.seller,
        {
          shippers: [],
          journeys: [],
          pieces: [
            {
              publish_id: order.publish!.id,
              good_id: order.goods[Math.floor(i / REPEAT)].id,
              stock_id:
                order.goods[Math.floor(i / REPEAT)].commodity.sale.units[0]
                  .stocks[0].id,
              quantity: 1,
            },
          ],
        },
      );
    typia.assertEquals(delivery);

    await validate([
      "underway",
      i === 0 ? "underway" : "inaction",
      i < 2 ? "none" : i === 3 ? "underway" : "inaction",
    ]);
    return delivery;
  });

  await ArrayUtil.asyncMap(TYPES)(async (current, i) => {
    const prev: IShoppingDelivery.State = i === 0 ? "underway" : TYPES[i - 1];
    await ArrayUtil.asyncMap(deliveries)(async (delivery, j) => {
      const journey: IShoppingDeliveryJourney =
        await ShoppingApi.functional.shoppings.sellers.deliveries.journeys.create(
          pool.seller,
          delivery.id,
          {
            type: current,
            title: null,
            description: null,
            started_at: new Date().toISOString(),
            completed_at: null,
          },
        );
      delivery.journeys.push(typia.assertEquals(journey));
      await validate([
        j === deliveries.length - 1 ? current : prev,
        j === 0 ? current : prev,
        j < 2 ? "none" : j === 3 ? current : prev,
      ]);
    });
  });

  await ArrayUtil.asyncMap(deliveries)(async (delivery, i) => {
    const last: IShoppingDeliveryJourney = delivery.journeys.at(-1)!;
    await ShoppingApi.functional.shoppings.sellers.deliveries.journeys.complete(
      pool.seller,
      delivery.id,
      last.id,
      {
        completed_at: new Date().toISOString(),
      },
    );
    await validate([
      i === deliveries.length - 1 ? "arrived" : "delivering",
      i === 0 ? "arrived" : "delivering",
      i < 2 ? "none" : i === 3 ? "arrived" : "delivering",
    ]);
  });

  await ArrayUtil.asyncMap(order.goods)(async (good, i) => {
    await ShoppingApi.functional.shoppings.customers.orders.goods.confirm(
      pool.customer,
      order.id,
      good.id,
    );
    await validate([
      i === order.goods.length - 1 ? "confirmed" : "arrived",
      i === 0 ? "confirmed" : "arrived",
      i < 2 ? "none" : i === 3 ? "confirmed" : "arrived",
    ]);
  });
};

const REPEAT = 2;
const TYPES = ["preparing", "manufacturing", "shipping", "delivering"] as const;
