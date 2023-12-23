import { IDiagnosis } from "@samchon/shopping-api/lib/structures/common/IDiagnosis";
import { IShoppingSaleUnit } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitOption } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitOption";
import { IShoppingSaleUnitStock } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitStock";
import { IShoppingSaleUnitStockChoice } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitStockChoice";

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
        })(stock.data.choices),
      );
      stock.data.choices.forEach((choice, i) => {
        output.push(
          ...ShoppingSaleUnitStockChoiceDiagnoser.validate(unit)(stock)({
            data: choice,
            index: i,
          }),
        );
      });
      return output;
    };

  export const replica =
    (options: IShoppingSaleUnitOption[]) =>
    (input: IShoppingSaleUnitStock): IShoppingSaleUnitStock.ICreate => ({
      name: input.name,
      choices: input.choices.map(
        ShoppingSaleUnitStockChoiceDiagnoser.replica(options),
      ),
      quantity: Math.max(0, input.inventory.income - input.inventory.outcome),
      price: {
        nominal: input.price.nominal,
        real: input.price.real,
      },
    });
}
