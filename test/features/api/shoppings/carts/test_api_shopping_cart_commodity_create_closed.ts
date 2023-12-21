import { TestValidator } from "@nestia/e2e";
import { sleep_until } from "tstl";

import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_create } from "../actors/test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_cart_commodity } from "./internal/generate_random_cart_commodity";

export const test_api_shopping_cart_commodity_create_closed = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_customer_create(pool);
  await test_api_shopping_actor_seller_join(pool);

  const closed_at: Date = new Date(Date.now() + 3_000);
  const sale: IShoppingSale = await generate_random_sale(pool, {
    closed_at: closed_at.toISOString(),
  });

  await generate_random_cart_commodity(pool, sale);
  await sleep_until(closed_at);
  await TestValidator.httpError("closed")(410)(() =>
    generate_random_cart_commodity(pool, sale),
  );
};
