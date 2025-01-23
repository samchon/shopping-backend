import { RandomGenerator, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";

export const test_api_shopping_cart_commodity_create_multiple = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_customer_join(pool);

  const page: IPage<IShoppingSale.ISummary> =
    await ShoppingApi.functional.shoppings.customers.sales.index(
      pool.customer,
      {
        search: {
          title: "macbook",
        },
        limit: 1,
        sort: ["+sale.created_at"],
      },
    );
  const sale: IShoppingSale =
    await ShoppingApi.functional.shoppings.customers.sales.at(
      pool.customer,
      page.data[0].id,
    );
  const commodity: IShoppingCartCommodity =
    await ShoppingApi.functional.shoppings.customers.carts.commodities.create(
      pool.customer,
      {
        sale_id: sale.id,
        stocks: sale.units.map((unit) => ({
          unit_id: unit.id,
          stock_id: RandomGenerator.pick(unit.stocks).id,
          choices: [],
          quantity: 1,
        })),
        volume: 1,
      },
    );
  TestValidator.equals("length")(sale.units.length)(
    commodity.sale.units.map((u) => u.stocks.length).reduce((a, b) => a + b, 0),
  );
};
