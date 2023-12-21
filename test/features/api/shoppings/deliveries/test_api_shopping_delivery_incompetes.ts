import { ArrayUtil, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingDelivery } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDelivery";
import { IShoppingDeliveryPiece } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryPiece";
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

export const test_api_shopping_delivery_incompletes = async (
  pool: ConnectionPool,
): Promise<void> => {
  const customer: IShoppingCustomer = await test_api_shopping_actor_customer_join(
    pool,
  );
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

  const validate = async (i: number) => {
    const incompletes: IShoppingDeliveryPiece.ICreate[] =
      await ShoppingApi.functional.shoppings.sellers.orders.incompletes(
        pool.seller,
        order.id,
      );
    typia.assertEquals(incompletes);
    TestValidator.equals("incompletes.length")(incompletes.length)(
      Math.ceil(REPEAT * REPEAT - i / REPEAT),
    );
    TestValidator.equals("incompletes[].quantity")(
      incompletes.map((it) => it.quantity).reduce((a, b) => a + b, 0),
    )(REPEAT * REPEAT - i);

    const delivery: IShoppingDelivery =
      await ShoppingApi.functional.shoppings.sellers.deliveries.create(
        pool.seller,
        {
          journeys: [],
          shippers: [],
          pieces: [],
        },
      );
    typia.assertEquals(delivery);
  };
  await ArrayUtil.asyncRepeat(REPEAT * REPEAT)(validate);

  const incompletes: IShoppingDeliveryPiece.ICreate[] =
    await ShoppingApi.functional.shoppings.sellers.orders.incompletes(
      pool.seller,
      order.id,
    );
  TestValidator.equals("empty")(incompletes.length)(0);
};
const REPEAT = 4;
