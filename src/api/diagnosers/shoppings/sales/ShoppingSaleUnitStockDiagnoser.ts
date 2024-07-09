import { IDiagnosis } from "../../../structures/common/IDiagnosis";
import { IShoppingSaleUnit } from "../../../structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitOption } from "../../../structures/shoppings/sales/IShoppingSaleUnitOption";
import { IShoppingSaleUnitStock } from "../../../structures/shoppings/sales/IShoppingSaleUnitStock";
import { IShoppingSaleUnitStockChoice } from "../../../structures/shoppings/sales/IShoppingSaleUnitStockChoice";

import { IIndexedInput } from "../../common/IIndexedInput";
import { UniqueDiagnoser } from "../../common/UniqueDiagnoser";
import { ShoppingSaleUnitStockChoiceDiagnoser } from "./ShoppingSaleUnitStockChoiceDiagnoser";

export namespace ShoppingSaleUnitStockDiagnoser {
  export const validate =
    (unit: IIndexedInput<IShoppingSaleUnit.ICreate>) =>
    (stock: IIndexedInput<IShoppingSaleUnitStock.ICreate>): IDiagnosis[] => {
      const output: IDiagnosis[] = [];
      output.push(
        ...UniqueDiagnoser.validate<IShoppingSaleUnitStockChoice.ICreate>({
          key: (c) => JSON.stringify([c.option_index, c.candidate_index]),
          message: (c, i) => ({
            accessor: `input.units[${unit.index}].stocks[${stock.index}].choices[${i}]`,
            message: `Duplicated choice: (${c.option_index}, ${c.candidate_index})`,
          }),
        })(stock.data.choices)
      );
      stock.data.choices.forEach((choice, i) => {
        output.push(
          ...ShoppingSaleUnitStockChoiceDiagnoser.validate(unit)(stock)({
            data: choice,
            index: i,
          })
        );
      });
      if (stock.data.price.nominal < stock.data.price.real)
        output.push({
          accessor: `input.units[${unit.index}].stocks[${stock.index}].price.real`,
          message: `Real price cannot be greater than nominal price`,
        });
      return output;
    };

  export const replica =
    (options: IShoppingSaleUnitOption[]) =>
    (input: IShoppingSaleUnitStock): IShoppingSaleUnitStock.ICreate => ({
      name: input.name,
      choices: input.choices.map(
        ShoppingSaleUnitStockChoiceDiagnoser.replica(options)
      ),
      quantity: Math.max(0, input.inventory.income - input.inventory.outcome),
      price: {
        nominal: input.price.nominal,
        real: input.price.real,
      },
    });
}
