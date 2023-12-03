import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { prepare_random_cart_commodity_stock } from "./prepare_random_cart_commodity_stock";

export const prepare_random_cart_commodity = (
  sale: IShoppingSale,
  input: Partial<IShoppingCartCommodity.ICreate> = {},
): IShoppingCartCommodity.ICreate => ({
  sale_id: sale.id,
  stocks: sale.units.map((unit) => prepare_random_cart_commodity_stock(unit)),
  volume: 1,
  ...input,
});
