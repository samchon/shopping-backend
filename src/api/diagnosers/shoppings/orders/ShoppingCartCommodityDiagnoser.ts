import { v4 } from "uuid";

import { IDiagnosis } from "../../../structures/common/IDiagnosis";
import { IShoppingCartCommodity } from "../../../structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingSale } from "../../../structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleUnit } from "../../../structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitStock } from "../../../structures/shoppings/sales/IShoppingSaleUnitStock";

import { MapUtil } from "../../../../utils/MapUtil";
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
          (u) => u.id === stock.unit_id
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
              i
            )
          );
      });
      return output;
    };

  export const replica = (
    commodity: IShoppingCartCommodity
  ): IShoppingCartCommodity.ICreate => ({
    sale_id: commodity.sale.id,
    stocks: commodity.sale.units
      .map((unit) =>
        unit.stocks.map((stock) =>
          ShoppingCartCommodityStockDiagnoser.replica({ unit, stock })
        )
      )
      .flat(),
    volume: commodity.volume,
  });

  export const preview =
    (sale: IShoppingSale) =>
    (input: IShoppingCartCommodity.ICreate): IShoppingCartCommodity => {
      const entries: [
        IShoppingSaleUnit.IInvert,
        IShoppingSaleUnitStock.IInvert,
      ][] = input.stocks.map((stockInput) => {
        const unit: IShoppingSaleUnit | undefined = sale.units.find(
          (u) => u.id === stockInput.unit_id
        );
        if (unit === undefined)
          throw new Error(
            `Error on ShoppingCartItemDiagnoser.preview(): unable to find the matched unit by its id "${stockInput.unit_id}".`
          );
        return [
          {
            id: unit.id,
            name: unit.name,
            primary: unit.primary,
            required: unit.required,
            stocks: [],
          },
          ShoppingCartCommodityStockDiagnoser.preview(unit)(stockInput),
        ] as const;
      });
      const unitDict = new Map<string, IShoppingSaleUnit.IInvert>();
      for (const [unit, stock] of entries)
        MapUtil.take(unitDict)(unit.id)(() => unit).stocks.push(stock);

      return {
        id: v4(),
        sale: {
          ...sale,
          content: {
            id: v4(),
            title: sale.content.title,
            thumbnails: sale.content.thumbnails,
          },
          units: [...unitDict.values()],
        },
        pseudo: true,
        volume: input.volume,
        price: {
          nominal: entries
            .map(([, stock]) => stock.price.nominal)
            .reduce((a, b) => a + b),
          real: entries
            .map(([, stock]) => stock.price.real)
            .reduce((a, b) => a + b),
        },
        created_at: new Date().toISOString(),
        orderable: true,
      };
    };
}
