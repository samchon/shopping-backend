import { IDiagnosis } from "@samchon/shopping-api/lib/structures/common/IDiagnosis";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingCartCommodityStock } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodityStock";
import { IShoppingCartCommodityStockChoice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodityStockChoice";
import { IShoppingSaleUnit } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitStock } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitStock";
import { IShoppingSaleUnitStockChoice } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitStockChoice";

import { ShoppingCartCommodityStockChoiceDiagnoser } from "./ShoppingCartCommodityStockChoiceDiagnoser";

export namespace ShoppingCartCommodityStockDiagnoser {
  export const validatae =
    (unit: IShoppingSaleUnit) =>
    (commodity: IShoppingCartCommodity.ICreate) =>
    (
      input: IShoppingCartCommodityStock.ICreate,
      sequence: number,
    ): IDiagnosis[] => {
      const output: IDiagnosis[] = [];
      input.choices.forEach((choice, i) => {
        ShoppingCartCommodityStockChoiceDiagnoser.validate(unit)(sequence)({
          data: choice,
          index: i,
        });
      });
      const stock: IShoppingSaleUnitStock | undefined = find(unit)(input);
      if (undefined === stock)
        output.push({
          accessor: `$input.stocks[${sequence}]`,
          message: `Unable to find the matched stock.`,
        });
      else if (
        stock.inventory.income - stock.inventory.outcome <
        input.quantity * commodity.volume
      )
        output.push({
          accessor: `$input.stocks[${sequence}].quantity`,
          message: `Insufficient inventory.`,
        });
      return output;
    };

  export const replica = (props: {
    unit: IShoppingSaleUnit.IInvert;
    stock: IShoppingSaleUnitStock.IInvert;
  }): IShoppingCartCommodityStock.ICreate => ({
    unit_id: props.unit.id,
    stock_id: props.stock.id,
    choices: props.stock.choices.map(
      ShoppingCartCommodityStockChoiceDiagnoser.replica,
    ),
    quantity: props.stock.quantity,
  });

  export const find =
    (unit: IShoppingSaleUnit) =>
    (
      input: IShoppingCartCommodityStock.ICreate,
    ): IShoppingSaleUnitStock | undefined => {
      if (unit.stocks.length === 1 && unit.stocks[0].choices.length === 0)
        return unit.stocks[0];

      const choices: IShoppingCartCommodityStockChoice.ICreate[] =
        input.choices.filter(
          (choice) =>
            choice.candidate_id !== null &&
            unit.options.find(
              (o) =>
                o.id === choice.option_id &&
                o.type === "select" &&
                o.variable === true,
            ) !== undefined,
        );
      for (const stock of unit.stocks) {
        const matched: IShoppingSaleUnitStockChoice[] = stock.choices.filter(
          (elem) =>
            elem.candidate_id !== null &&
            choices.find(
              (choice) =>
                choice.option_id === elem.option_id &&
                choice.candidate_id === elem.candidate_id,
            ) !== undefined,
        );
        if (choices.length === matched.length) return stock;
      }
      return undefined;
    };
}
