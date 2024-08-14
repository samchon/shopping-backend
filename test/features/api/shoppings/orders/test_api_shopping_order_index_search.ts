import { ArrayUtil, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_order } from "./internal/generate_random_order";
import { generate_random_order_publish } from "./internal/generate_random_order_publish";

export const test_api_shopping_order_index_search = async (
  pool: ConnectionPool,
): Promise<void> => {
  const customer: IShoppingCustomer =
    await test_api_shopping_actor_customer_join(pool);
  const orderList: IShoppingOrder[] = await ArrayUtil.asyncRepeat(REPEAT)(
    async () => {
      await test_api_shopping_actor_seller_join(pool);

      const sale: IShoppingSale = await generate_random_sale(pool);
      const commodity: IShoppingCartCommodity =
        await generate_random_cart_commodity(pool, sale);
      const order: IShoppingOrder = await generate_random_order(pool, [
        commodity,
      ]);
      order.publish = await generate_random_order_publish(
        pool,
        customer,
        order,
        true,
      );

      return order;
    },
  );

  // PREPARE VALIDATOR
  const validator = TestValidator.search("search orders")(
    async (input: IShoppingOrder.IRequest.ISearch) => {
      const page: IPage<IShoppingOrder> =
        await ShoppingApi.functional.shoppings.customers.orders.index(
          pool.customer,
          {
            search: input,
            sort: ["-order.created_at"],
            limit: orderList.length,
          },
        );
      return page.data;
    },
  )(orderList, 2);

  //----
  // DO VALIDATE
  //----
  // PAID STATUS
  await validator({
    fields: ["paid"],
    values: () => [true],
    filter: (order) => order.publish !== null && order.publish.paid_at !== null,
    request: () => ({ paid: true }),
  });
  await validator({
    fields: ["paid"],
    values: () => [false],
    filter: (order) => order.publish === null || order.publish.paid_at === null,
    request: () => ({ paid: false }),
  });

  // PRICE RANGE
  await validator({
    fields: ["min_price", "max_price"],
    values: (order) => [order.price.real * 0.9, order.price.real * 1.1],
    filter: (order, [min, max]) =>
      min <= order.price.real && order.price.real <= max,
    request: ([min_price, max_price]) => ({
      min_price,
      max_price,
      paid: null,
    }),
  });

  // ABOUT SALES
  await validator({
    fields: ["sale.content.title"],
    values: (order) => [order.goods[0].commodity.sale.content.title],
    filter: (order, [title]) =>
      order.goods.some((good) =>
        good.commodity.sale.content.title.includes(title),
      ),
    request: ([title]) => ({
      sale: {
        title,
      },
    }),
  });

  // ABOUT SELLERS
  await validator({
    fields: ["seller.name"],
    values: (order) => [order.goods[0].commodity.sale.seller.citizen.name],
    filter: (order, [name]) =>
      order.goods.some(
        (good) => good.commodity.sale.seller.citizen.name === name,
      ),
    request: ([name]) => ({
      sale: {
        seller: {
          name,
        },
      },
    }),
  });
};

const REPEAT = 25;
