import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { prepare_random_sale } from "./prepare_random_sale";

export const generate_random_sale = async (
  pool: ConnectionPool,
  input?: Partial<IShoppingSale.ICreate>
): Promise<IShoppingSale> => {
  const sale: IShoppingSale =
    await ShoppingApi.functional.shoppings.sellers.sales.create(
      pool.seller,
      await prepare_random_sale(pool, input)
    );
  return sale;
};
