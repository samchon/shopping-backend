import { IDiagnosis } from "@samchon/shopping-api/lib/structures/common/IDiagnosis";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleUnit } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnit";

import { ShoppingSaleDiagnoser } from "../sales";
import { ShoppingCartCommodityStockDiagnoser } from "./ShoppingCartCommodityStockDiagnoser";

export namespace ShoppingCartCommodityDiagnoser {
  export const validate =
    (sale: IShoppingSale) =>
    (input: IShoppingCartCommodity.ICreate): IDiagnosis[] => {
      // ABOUT SALE
      const output: IDiagnosis[] = ShoppingSaleDiagnoser.readable({
        accessor: "$input.sale_id",
        checkPause: true,
      })(sale);

      // ABOUT STOCKS
      input.stocks.forEach((stock, i) => {
        const unit: IShoppingSaleUnit | undefined = sale.units.find(
          (u) => u.id === stock.unit_id,
        );
        if (unit === undefined)
          output.push({
            accessor: `$input.stocks[${i}].unit_id`,
            message: `Unable to find the matched unit.`,
          });
        else
          output.push(
            ...ShoppingCartCommodityStockDiagnoser.validatae(unit)(input)(
              stock,
              i,
            ),
          );
      });
      return output;
    };

  export const replica = (
    commodity: IShoppingCartCommodity,
  ): IShoppingCartCommodity.ICreate => ({
    sale_id: commodity.sale.id,
    stocks: commodity.sale.units
      .map((unit) =>
        unit.stocks.map((stock) =>
          ShoppingCartCommodityStockDiagnoser.replica({ unit, stock }),
        ),
      )
      .flat(),
    volume: commodity.volume,
  });
}
