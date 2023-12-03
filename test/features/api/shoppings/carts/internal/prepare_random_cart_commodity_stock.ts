import { RandomGenerator } from "@nestia/e2e";
import { randint } from "tstl";

import { IShoppingCartCommodityStock } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodityStock";
import { IShoppingSaleUnit } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitStock } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitStock";

export const prepare_random_cart_commodity_stock = (
  unit: IShoppingSaleUnit,
  input: Partial<IShoppingCartCommodityStock.ICreate> = {},
): IShoppingCartCommodityStock.ICreate => {
  const stock: IShoppingSaleUnitStock = RandomGenerator.pick(unit.stocks);
  return {
    unit_id: unit.id,
    stock_id: stock.id,
    choices: [
      ...stock.choices.map((elem) => ({
        option_id: elem.option_id,
        candidate_id: elem.candidate_id,
        value: null,
      })),
      ...unit.options
        .filter((o) => o.type !== "select")
        .map((o) => ({
          option_id: o.id,
          candidate_id: null,
          value: String(
            o.type === "boolean"
              ? RandomGenerator.pick([true, false])
              : o.type === "number"
              ? randint(0, 100)
              : "something",
          ),
        })),
    ],
    quantity: 1,
    ...input,
  };
};
