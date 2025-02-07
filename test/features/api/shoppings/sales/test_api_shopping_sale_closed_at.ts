import { sleep_until } from "tstl";

import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_customer_create } from "../actors/test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "./internal/generate_random_sale";
import { validate_sale_at } from "./internal/validate_sale_at";
import { validate_sale_index } from "./internal/validate_sale_index";

export const test_api_shopping_sale_closed_at = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_seller_join(pool);
  await test_api_shopping_actor_customer_create(pool);

  const closed_at: Date = new Date(Date.now() + 5_000);
  const sale: IShoppingSale = await generate_random_sale(pool, {
    opened_at: new Date().toISOString(),
    closed_at: closed_at.toISOString(),
  });
  await validate_sale_at({
    pool,
    sale,
    visibleToCustomer: true,
  });
  await validate_sale_index({
    pool,
    sales: [sale],
    visibleInCustomer: true,
  });

  await sleep_until(closed_at);
  await validate_sale_at({
    pool,
    sale,
    visibleToCustomer: false,
  });
  await validate_sale_index({
    pool,
    sales: [sale],
    visibleInCustomer: false,
  });
};
