import { TestValidator } from "@nestia/e2e";
import { sleep_until } from "tstl";

import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_create } from "../actors/test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_cart_commodity } from "./internal/generate_random_cart_commodity";

export const test_api_shopping_cart_commodity_create_unopened = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_customer_create(pool);
  await test_api_shopping_actor_seller_join(pool);

  const opened_at: Date = new Date(Date.now() + 5_000);
  const sale: IShoppingSale = await generate_random_sale(pool, {
    opened_at: opened_at.toISOString(),
  });

  await TestValidator.httpError("not opened", 422, () =>
    generate_random_cart_commodity(pool, sale),
  );
  await sleep_until(opened_at);
  await generate_random_cart_commodity(pool, sale);
};
