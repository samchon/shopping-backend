import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { prepare_random_cart_commodity } from "./prepare_random_cart_commodity";

export const generate_random_cart_commodity = async (
  pool: ConnectionPool,
  sale: IShoppingSale,
  input: Partial<IShoppingCartCommodity.ICreate> = {},
): Promise<IShoppingCartCommodity> => {
  const item: IShoppingCartCommodity =
    await ShoppingApi.functional.shoppings.customers.carts.commodities.create(
      pool.customer,
      null,
      prepare_random_cart_commodity(sale, input),
    );
  return item;
};
