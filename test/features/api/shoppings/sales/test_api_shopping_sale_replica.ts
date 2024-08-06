import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { prepare_random_sale } from "./internal/prepare_random_sale";

export const test_api_shopping_sale_replica = async (
  pool: ConnectionPool
): Promise<void> => {
  await test_api_shopping_actor_seller_join(pool);

  const input: IShoppingSale.ICreate = await prepare_random_sale(pool);
  const sale: IShoppingSale =
    await ShoppingApi.functional.shoppings.sellers.sales.create(
      pool.seller,
      input
    );
  const replica: IShoppingSale.ICreate =
    await ShoppingApi.functional.shoppings.sellers.sales.replica(
      pool.seller,
      sale.id
    );
  TestValidator.equals("replica")(input)(replica);
};
