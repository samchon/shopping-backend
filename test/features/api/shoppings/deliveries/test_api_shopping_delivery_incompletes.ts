import { ArrayUtil, TestValidator } from "@nestia/e2e";
import { IPointer, randint } from "tstl";
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
      volume: REPEAT / 4,
      stocks: sale.units.map((unit) =>
        prepare_random_cart_commodity_stock(unit, { quantity: REPEAT / 4 }),
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

  const left: IPointer<number> = {
    value: order.goods
      .map(
        (good) =>
          good.volume *
          good.commodity.sale.units
            .map((u) => u.stocks.map((s) => s.quantity))
            .flat()
            .flat()
            .reduce((a, b) => a + b, 0),
      )
      .reduce((a, b) => a + b, 0),
  };
  while (left.value > 0) {
    // VALIDATE INCOMPLETES
    const incompletes: IShoppingDeliveryPiece.ICreate[] =
      await ShoppingApi.functional.shoppings.sellers.deliveries.incompletes(
        pool.seller,
        {
          publish_ids: [order.publish!.id],
        },
      );
    typia.assertEquals(incompletes);
    TestValidator.equals("left")(left.value)(
      incompletes.map((i) => i.quantity).reduce((a, b) => a + b, 0),
    );

    // PREPARE NEW DELIVERY INPUT
    const input: IShoppingDeliveryPiece.ICreate[] = [];
    const quantity: number = Math.min(left.value, randint(1, 4));
    const remainder: IPointer<number> = { value: quantity };

    for (const i of incompletes) {
      const target: number = Math.min(i.quantity, remainder.value);
      input.push({
        ...i,
        quantity: target,
      });
      remainder.value -= target;
      if (remainder.value === 0) break;
    }

    // DO CREATE IT
    const delivery: IShoppingDelivery =
      await ShoppingApi.functional.shoppings.sellers.deliveries.create(
        pool.seller,
        {
          journeys: [],
          shippers: [],
          pieces: input,
        },
      );
    typia.assertEquals(delivery);
    TestValidator.equals("quantity")(quantity)(
      delivery.pieces.map((i) => i.quantity).reduce((a, b) => a + b, 0),
    );

    left.value -= quantity;
  }

  // NO MORE INCOMPLETES
  const incompletes: IShoppingDeliveryPiece.ICreate[] =
    await ShoppingApi.functional.shoppings.sellers.deliveries.incompletes(
      pool.seller,
      {
        publish_ids: [order.publish.id],
      },
    );
  TestValidator.equals("empty")(incompletes.length)(0);
};
const REPEAT = 4;
