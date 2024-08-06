import { ArrayUtil, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingDelivery } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDelivery";
import { IShoppingDeliveryJourney } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryJourney";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderGood } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderGood";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_order } from "../orders/internal/generate_random_order";
import { generate_random_order_publish } from "../orders/internal/generate_random_order_publish";
import { generate_random_sole_sale } from "../sales/internal/generate_random_sole_sale";

export const test_api_shopping_delivery_state = async (
  pool: ConnectionPool
): Promise<void> => {
  const customer: IShoppingCustomer =
    await test_api_shopping_actor_customer_join(pool);
  await test_api_shopping_actor_seller_join(pool);

  const saleList: IShoppingSale[] = await ArrayUtil.asyncRepeat(2)(() =>
    generate_random_sole_sale(pool, {
      nominal: 100_000,
      real: 50_000,
    })
  );
  const commodities: IShoppingCartCommodity[] = await ArrayUtil.asyncMap(
    saleList
  )((sale) =>
    generate_random_cart_commodity(pool, sale, {
      volume: 2,
      stocks: [
        {
          unit_id: sale.units[0].id,
          stock_id: sale.units[0].stocks[0].id,
          choices: [],
          quantity: 2,
        },
      ],
    })
  );
  const order: IShoppingOrder = await generate_random_order(
    pool,
    commodities,
    () => 2
  );
  order.publish = await generate_random_order_publish(
    pool,
    customer,
    order,
    true
  );

  const validate = async (states: IShoppingDelivery.State[]) => {
    const read: IShoppingOrder =
      await ShoppingApi.functional.shoppings.customers.orders.at(
        pool.customer,
        order.id
      );
    TestValidator.equals("states")([
      read.publish!.state,
      ...read.goods.map((g) => g.state!),
    ])(states);
  };
  await validate(["none", "none", "none"]);

  const deliveries: IShoppingDelivery[] = await ArrayUtil.asyncRepeat(8)(
    async (i) => {
      const good: IShoppingOrderGood = order.goods[Math.floor(i / 4)];
      const delivery: IShoppingDelivery =
        await ShoppingApi.functional.shoppings.sellers.deliveries.create(
          pool.seller,
          {
            shippers: [],
            journeys: [
              {
                type: "preparing",
                title: "title",
                description: "description",
                started_at: new Date().toISOString(),
                completed_at: null,
              },
            ],
            pieces: [
              {
                publish_id: order.publish!.id,
                good_id: good.id,
                stock_id: good.commodity.sale.units[0].stocks[0].id,
                quantity: 1,
              },
            ],
          }
        );
      await validate([
        i === 7 ? "preparing" : "underway",
        i >= 3 ? "preparing" : "underway",
        i < 4 ? "none" : i === 7 ? "preparing" : "underway",
      ]);
      return delivery;
    }
  );

  await ArrayUtil.asyncMap(TYPES)(async (current, i) => {
    const prev: IShoppingDelivery.State = i === 0 ? "preparing" : TYPES[i - 1];
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
          }
        );
      delivery.journeys.push(journey);
      await validate([
        j === 7 ? current : prev,
        j >= 3 ? current : prev,
        j === 7 ? current : prev,
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
      }
    );
    await validate([
      i === deliveries.length - 1 ? "arrived" : "delivering",
      i >= 3 ? "arrived" : "delivering",
      i === 7 ? "arrived" : "delivering",
    ]);
  });
};

const TYPES = ["manufacturing", "shipping", "delivering"] as const;
