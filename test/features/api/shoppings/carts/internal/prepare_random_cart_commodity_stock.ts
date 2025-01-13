import { RandomGenerator } from "@nestia/e2e";

import { IShoppingCartCommodityStock } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodityStock";
import { IShoppingSaleUnit } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitStock } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitStock";

export const prepare_random_cart_commodity_stock = (
  unit: IShoppingSaleUnit,
  input: Partial<IShoppingCartCommodityStock.ICreate> = {}
): IShoppingCartCommodityStock.ICreate => {
  const stock: IShoppingSaleUnitStock = RandomGenerator.pick(unit.stocks);
  return {
    unit_id: unit.id,
    stock_id: stock.id,
    choices: [],
    quantity: 1,
    ...input,
  };
};
