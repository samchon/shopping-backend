import { IDiagnosis } from "../../../structures/common/IDiagnosis";
import { IShoppingCartCommodity } from "../../../structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingCartCommodityStock } from "../../../structures/shoppings/orders/IShoppingCartCommodityStock";
import { IShoppingCartCommodityStockChoice } from "../../../structures/shoppings/orders/IShoppingCartCommodityStockChoice";
import { IShoppingSaleUnit } from "../../../structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitStock } from "../../../structures/shoppings/sales/IShoppingSaleUnitStock";
import { IShoppingSaleUnitStockChoice } from "../../../structures/shoppings/sales/IShoppingSaleUnitStockChoice";

import { ShoppingCartCommodityStockChoiceDiagnoser } from "./ShoppingCartCommodityStockChoiceDiagnoser";

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
    const stock: IShoppingSaleUnitStock | undefined = find(props);
    if (undefined === stock)
      output.push({
        accessor: `$input.stocks[${props.index}]`,
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
    choices: props.stock.choices.map(
      ShoppingCartCommodityStockChoiceDiagnoser.replica
    ),
    quantity: props.stock.quantity,
  });

  export const find = (props: {
    unit: IShoppingSaleUnit;
    input: IShoppingCartCommodityStock.ICreate;
  }): IShoppingSaleUnitStock | undefined => {
    if (
      props.unit.stocks.length === 1 &&
      props.unit.stocks[0].choices.length === 0
    )
      return props.unit.stocks[0];

    const choices: IShoppingCartCommodityStockChoice.ICreate[] =
      props.input.choices.filter(
        (choice) =>
          choice.candidate_id !== null &&
          props.unit.options.find(
            (o) =>
              o.id === choice.option_id &&
              o.type === "select" &&
              o.variable === true
          ) !== undefined
      );
    for (const stock of props.unit.stocks) {
      const matched: IShoppingSaleUnitStockChoice[] = stock.choices.filter(
        (elem) =>
          elem.candidate_id !== null &&
          choices.find(
            (choice) =>
              choice.option_id === elem.option_id &&
              choice.candidate_id === elem.candidate_id
          ) !== undefined
      );
      if (choices.length === matched.length) return stock;
    }
    return undefined;
  };

  export const preview = (props: {
    unit: IShoppingSaleUnit;
    input: IShoppingCartCommodityStock.ICreate;
  }): IShoppingSaleUnitStock.IInvert => {
    const stock: IShoppingSaleUnitStock | undefined = find(props);
    if (stock === undefined)
      throw new Error("Unable to find the matched stock.");
    return {
      id: stock.id,
      name: stock.name,
      price: stock.price,
      inventory: stock.inventory,
      quantity: props.input.quantity,
      choices: props.input.choices.map((raw) => {
        const choice = stock.choices.find(
          (c) =>
            c.option_id === raw.option_id && c.candidate_id === raw.candidate_id
        );
        if (choice === undefined)
          throw new Error("Unable to find the matched choice.");
        const option = props.unit.options.find(
          (o) => o.id === choice.option_id
        );
        if (option === undefined)
          throw new Error("Unable to find the matched option.");
        return {
          id: choice.id,
          option,
          candidate:
            option.type === "select" && raw.candidate_id !== null
              ? (option.candidates.find((c) => c.id === raw.candidate_id) ??
                null)
              : null,
          value: raw.value,
        };
      }),
    };
  };
}
