import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_admin_login } from "../actors/test_api_hub_admin_login";
import { test_api_shopping_customer_create } from "../actors/test_api_shopping_customer_create";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_sale } from "./internal/generate_random_sale";
import { validate_sale_at } from "./internal/validate_sale_at";
import { validate_sale_index } from "./internal/validate_sale_index";

export const test_api_shopping_sale_create = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_admin_login(pool);
  await test_api_shopping_customer_create(pool);
  await test_api_shopping_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  await validate_sale_at(pool)(sale)(true);
  await validate_sale_index(pool)([sale])(true);
};
