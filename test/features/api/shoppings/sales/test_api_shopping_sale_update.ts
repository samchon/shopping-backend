import { ArrayUtil, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_customer_create } from "../actors/test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "./internal/generate_random_sale";
import { prepare_random_sale } from "./internal/prepare_random_sale";

export const test_api_shopping_sale_update = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_customer_create(pool);
  await test_api_shopping_actor_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  const total: IShoppingSale[] = [
    sale,
    ...(await ArrayUtil.asyncRepeat(3, async () =>
      ShoppingApi.functional.shoppings.sellers.sales.update(
        pool.seller,
        sale.id,
        await prepare_random_sale(pool),
      ),
    )),
  ];
  total.forEach((sale, i) => (sale.latest = i === total.length - 1));

  const read: IShoppingSale[] = await ArrayUtil.asyncMap(total, (s) =>
    ShoppingApi.functional.shoppings.sellers.sales.snapshots.flip(
      pool.seller,
      sale.id,
      s.snapshot_id,
    ),
  );
  TestValidator.equals("snapshots", total, read);

  const readByCustomer: IShoppingSale =
    await ShoppingApi.functional.shoppings.customers.sales.at(
      pool.customer,
      sale.id,
    );
  TestValidator.equals("byCustomer", total.at(-1), readByCustomer);
};
