import { IDiagnosis } from "../../../structures/common/IDiagnosis";
import { IShoppingSaleUnit } from "../../../structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitOption } from "../../../structures/shoppings/sales/IShoppingSaleUnitOption";
import { IShoppingSaleUnitStock } from "../../../structures/shoppings/sales/IShoppingSaleUnitStock";
import { IShoppingSaleUnitStockChoice } from "../../../structures/shoppings/sales/IShoppingSaleUnitStockChoice";

import { UniqueDiagnoser } from "../../common/UniqueDiagnoser";
import { ShoppingSaleUnitStockChoiceDiagnoser } from "./ShoppingSaleUnitStockChoiceDiagnoser";

export namespace ShoppingSaleUnitStockDiagnoser {
  export const validate = (props: {
    unit: IShoppingSaleUnit.ICreate;
    unitIndex: number;
    stock: IShoppingSaleUnitStock.ICreate;
    index: number;
  }): IDiagnosis[] => {
    const output: IDiagnosis[] = [];
    output.push(
      ...UniqueDiagnoser.validate<IShoppingSaleUnitStockChoice.ICreate>({
        key: (c) => JSON.stringify([c.option_index, c.candidate_index]),
        message: (c, i) => ({
          accessor: `input.units[${props.unitIndex}].stocks[${props.index}].choices[${i}]`,
          message: `Duplicated choice: (${c.option_index}, ${c.candidate_index})`,
        }),
        items: props.stock.choices,
      })
    );
    props.stock.choices.forEach((choice, i) => {
      output.push(
        ...ShoppingSaleUnitStockChoiceDiagnoser.validate({
          unit: props.unit,
          unitIndex: props.unitIndex,
          stock: props.stock,
          stockIndex: props.index,
          choice,
          index: i,
        })
      );
    });
    if (props.stock.price.nominal < props.stock.price.real)
      output.push({
        accessor: `input.units[${props.unitIndex}].stocks[${props.index}].price.real`,
        message: `Real price cannot be greater than nominal price`,
      });
    return output;
  };

  export const replica = (props: {
    options: IShoppingSaleUnitOption[];
    stock: IShoppingSaleUnitStock;
  }): IShoppingSaleUnitStock.ICreate => ({
    name: props.stock.name,
    choices: props.stock.choices.map((choice) =>
      ShoppingSaleUnitStockChoiceDiagnoser.replica({
        options: props.options,
        choice: choice,
      })
    ),
    quantity: Math.max(
      0,
      props.stock.inventory.income - props.stock.inventory.outcome
    ),
    price: {
      nominal: props.stock.price.nominal,
      real: props.stock.price.real,
    },
  });
}
