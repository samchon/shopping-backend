import { sleep_until } from "tstl";

import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_customer_create } from "../actors/test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "./internal/generate_random_sale";
import { validate_sale_at } from "./internal/validate_sale_at";
import { validate_sale_index } from "./internal/validate_sale_index";

export const test_api_shopping_sale_opened_at = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_seller_join(pool);
  await test_api_shopping_actor_customer_create(pool);

  const opened_at: Date = new Date(Date.now() + 3 * 1_000);
  const sale: IShoppingSale = await generate_random_sale(pool, {
    opened_at: opened_at.toISOString(),
    closed_at: null,
  });
  await validate_sale_at(pool)(sale)(false);
  await validate_sale_index(pool)([sale])(false);

  await sleep_until(opened_at);
  await validate_sale_at(pool)(sale)(true);
  await validate_sale_index(pool)([sale])(true);
};
