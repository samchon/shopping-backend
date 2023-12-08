import { ArrayUtil, GaffComparator, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_customer_join } from "../actors/test_api_shopping_customer_join";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_order } from "./internal/generate_random_order";
import { generate_random_order_publish } from "./internal/generate_random_order_publish";

export const test_api_shopping_order_index_sort = async (
  pool: ConnectionPool,
): Promise<void> => {
  const customer: IShoppingCustomer = await test_api_shopping_customer_join(
    pool,
  );
  const orderList: IShoppingOrder[] = await ArrayUtil.asyncRepeat(REPEAT)(
    async () => {
      await test_api_shopping_seller_join(pool);

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
  const validator = TestValidator.sort("sort orders")<
    IShoppingOrder,
    IShoppingOrder.IRequest.SortableColumns,
    IPage.Sort<IShoppingOrder.IRequest.SortableColumns>
  >(async (input: IPage.Sort<IShoppingOrder.IRequest.SortableColumns>) => {
    const page: IPage<IShoppingOrder> =
      await ShoppingApi.functional.shoppings.customers.orders.index(
        pool.customer,
        {
          sort: input,
          limit: orderList.length,
        },
      );
    return typia.assertEquals(page).data;
  });

  // COLUMNS TO SORT
  const components = [
    validator("order.price")(GaffComparator.numbers((x) => x.price.real)),
    validator("order.quantity")(
      GaffComparator.numbers((x) =>
        x.goods.map(
          (oi) =>
            oi.volume *
            oi.commodity.sale.units
              .map((u) =>
                u.stocks.map((s) => s.quantity).reduce((x, y) => x + y),
              )
              .reduce((x, y) => x + y),
        ),
      ),
    ),
    validator("order.created_at")(GaffComparator.dates((x) => x.created_at)),
    validator("order.paid_at")(
      GaffComparator.dates((x) => x.publish?.paid_at ?? "9999-12-31 09:00:00"),
    ),
  ];

  // DO VALIDATE
  for (const comp of components) {
    await comp("+");
    await comp("-");
  }
};

const REPEAT = 25;
