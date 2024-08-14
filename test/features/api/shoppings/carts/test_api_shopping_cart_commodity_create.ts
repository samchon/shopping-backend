import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_create } from "../actors/test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_cart_commodity } from "./internal/generate_random_cart_commodity";

export const test_api_shopping_cart_commodity_create = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_customer_create(pool);
  await test_api_shopping_actor_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  const commodity: IShoppingCartCommodity =
    await generate_random_cart_commodity(pool, sale);

  const page: IPage<IShoppingCartCommodity> =
    await ShoppingApi.functional.shoppings.customers.carts.commodities.index(
      pool.customer,
      null,
      {
        limit: 1,
        sort: ["-commodity.created_at"],
      },
    );
  TestValidator.equals("index")(commodity)(page.data[0]);

  const read: IShoppingCartCommodity =
    await ShoppingApi.functional.shoppings.customers.carts.commodities.at(
      pool.customer,
      null,
      commodity.id,
    );
  TestValidator.equals("read")(commodity)(read);
};
