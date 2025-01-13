import { v4 } from "uuid";
import { IDiagnosis } from "../../../structures/common/IDiagnosis";
import { IShoppingCartCommodity } from "../../../structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingCartCommodityStock } from "../../../structures/shoppings/orders/IShoppingCartCommodityStock";
import { IShoppingSaleUnit } from "../../../structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitStock } from "../../../structures/shoppings/sales/IShoppingSaleUnitStock";
import { IShoppingSaleUnitStockChoice } from "../../../structures/shoppings/sales/IShoppingSaleUnitStockChoice";

import { ShoppingCartCommodityStockChoiceDiagnoser } from "./ShoppingCartCommodityStockChoiceDiagnoser";
import { IShoppingSaleUnitSelectableOption } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitSelectableOption";

export namespace ShoppingCartCommodityStockDiagnoser {
  export const validate = (props: {
    unit: IShoppingSaleUnit;
    commodity: IShoppingCartCommodity.ICreate;
    input: IShoppingCartCommodityStock.ICreate;
    index: number;
  }): IDiagnosis[] => {
    const output: IDiagnosis[] = [];
    props.input.choices.forEach((choice, i) => {
      ShoppingCartCommodityStockChoiceDiagnoser.validate({
        unit: props.unit,
        stockIndex: props.index,
        input: choice,
        index: i,
      });
    });
    const stock: IShoppingSaleUnitStock | undefined = props.unit.stocks.find(
      (stock) => stock.id === props.input.stock_id
    );
    if (stock === undefined)
      output.push({
        accessor: `$input.stocks[${props.index}].stock_id`,
        message: `Unable to find the matched stock.`,
      });
    else if (
      stock.inventory.income - stock.inventory.outcome <
      props.input.quantity * props.commodity.volume
    )
      output.push({
        accessor: `$input.stocks[${props.index}].quantity`,
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
    choices: props.stock.choices
      .map(ShoppingCartCommodityStockChoiceDiagnoser.replica)
      .filter((c) => c !== null),
    quantity: props.stock.quantity,
  });

  export const preview = (props: {
    unit: IShoppingSaleUnit;
    input: IShoppingCartCommodityStock.ICreate;
  }): IShoppingSaleUnitStock.IInvert => {
    const stock: IShoppingSaleUnitStock | undefined = props.unit.stocks.find(
      (stock) => stock.id === props.input.stock_id
    );
    if (stock === undefined)
      throw new Error("Unable to find the matched stock.");
    return {
      id: stock.id,
      name: stock.name,
      price: stock.price,
      inventory: stock.inventory,
      quantity: props.input.quantity,
      choices: [
        ...stock.choices.map((choice) => {
          const option = props.unit.options.find(
            (o) => o.id === choice.option_id
          )!;
          const candidate = (
            option as IShoppingSaleUnitSelectableOption
          ).candidates.find((c) => c.id === choice.candidate_id)!;
          return {
            id: choice.id,
            option,
            candidate,
            value: null,
          } satisfies IShoppingSaleUnitStockChoice.IInvert;
        }),
        ...props.input.choices.map((choice) => {
          const option = props.unit.options.find(
            (o) => o.id === choice.option_id
          )!;
          return {
            id: v4(),
            option,
            candidate: null,
            value: choice.value,
          } satisfies IShoppingSaleUnitStockChoice.IInvert;
        }),
      ],
    };
  };
}
