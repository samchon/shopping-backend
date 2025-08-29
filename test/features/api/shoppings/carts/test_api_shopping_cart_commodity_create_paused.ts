import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_create } from "../actors/test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_cart_commodity } from "./internal/generate_random_cart_commodity";

export const test_api_shopping_cart_commodity_create_paused = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_customer_create(pool);
  await test_api_shopping_actor_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  await ShoppingApi.functional.shoppings.sellers.sales.pause(
    pool.seller,
    sale.id,
  );
  await TestValidator.httpError("paused", 422, () =>
    generate_random_cart_commodity(pool, sale),
  );
};
