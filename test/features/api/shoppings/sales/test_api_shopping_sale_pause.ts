import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_customer_create } from "../actors/test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "./internal/generate_random_sale";
import { validate_sale_at } from "./internal/validate_sale_at";
import { validate_sale_index } from "./internal/validate_sale_index";

export const test_api_shopping_sale_pause = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_customer_create(pool);
  await test_api_shopping_actor_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  await ShoppingApi.functional.shoppings.sellers.sales.pause(
    pool.seller,
    sale.id,
  );
  const read: IShoppingSale =
    await ShoppingApi.functional.shoppings.sellers.sales.at(
      pool.seller,
      sale.id,
    );

  await validate_sale_at({
    pool,
    sale: read,
    visibleToCustomer: true,
  });
  await validate_sale_index({
    pool,
    sales: [read],
    visibleInCustomer: true,
  });
  TestValidator.equals("paused_at", !!read.paused_at, true);

  await ShoppingApi.functional.shoppings.sellers.sales.restore(
    pool.seller,
    sale.id,
  );
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
};
