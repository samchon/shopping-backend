import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_create } from "../actors/test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { prepare_random_cart_commodity } from "./internal/prepare_random_cart_commodity";

export const test_api_shopping_cart_commodity_replica = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_customer_create(pool);
  await test_api_shopping_actor_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  const input: IShoppingCartCommodity.ICreate =
    prepare_random_cart_commodity(sale);

  const commodity: IShoppingCartCommodity =
    await ShoppingApi.functional.shoppings.customers.carts.commodities.create(
      pool.customer,
      null,
      input,
    );
  const replica: IShoppingCartCommodity.ICreate =
    await ShoppingApi.functional.shoppings.customers.carts.commodities.replica(
      pool.customer,
      null,
      commodity.id,
    );
  typia.assertEquals(replica);

  TestValidator.equals("replica")(input)(replica);
};
