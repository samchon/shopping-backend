import { IDiagnosis } from "../../../structures/common/IDiagnosis";
import { IShoppingSaleUnit } from "../../../structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitOption } from "../../../structures/shoppings/sales/IShoppingSaleUnitOption";
import { IShoppingSaleUnitStock } from "../../../structures/shoppings/sales/IShoppingSaleUnitStock";

import { IIndexedInput } from "../../common/IIndexedInput";
import { UniqueDiagnoser } from "../../common/UniqueDiagnoser";
import { ShoppingSaleUnitOptionDiagnoser } from "./ShoppingSaleUnitOptionDiagnoser";
import { ShoppingSaleUnitStockDiagnoser } from "./ShoppingSaleUnitStockDiagnoser";

export namespace ShoppingSaleUnitDiagnoser {
  export const validate = (
    unit: IIndexedInput<IShoppingSaleUnit.ICreate>
  ): IDiagnosis[] => {
    const accessor: string = `input.units[${unit.index}]`;
    const output: IDiagnosis[] = [];

    // OPTIONS
    output.push(
      ...UniqueDiagnoser.validate<IShoppingSaleUnitOption.ICreate>({
        key: (s) => s.name,
        message: (o, i) => ({
          accessor: `${accessor}.options[${i}]`,
          message: `Duplicated option name: "${o.name}"`,
        }),
      })(unit.data.options)
    );
    unit.data.options.forEach((option, i) =>
      output.push(
        ...ShoppingSaleUnitOptionDiagnoser.validate(unit)({
          data: option,
          index: i,
        })
      )
    );

    // STOCKS
    if (unit.data.stocks.length === 0)
      output.push({
        accessor: `${accessor}.stocks.length`,
        message: "No stock exists.",
      });
    else {
      const count: number = unit.data.options
        .map((o) =>
          o.type === "select" && o.variable ? o.candidates.length : 1
        )
        .reduce((a, b) => a * b, 1);
      if (unit.data.stocks.length > count)
        output.push({
          accessor: `${accessor}.stocks.length`,
          message: `Incorrect number of stocks: must not over the ${count} but ${unit.data.stocks.length}.`,
        });
    }
    output.push(
      ...UniqueDiagnoser.validate<IShoppingSaleUnitStock.ICreate>({
        key: (s) => s.name,
        message: (o, i) => ({
          accessor: `${accessor}.stocks[${i}]`,
          message: `Duplicated stock name: "${o.name}"`,
        }),
      })(unit.data.stocks)
    );

    return output;
  };

  export const replica = (
    unit: IShoppingSaleUnit
  ): IShoppingSaleUnit.ICreate => ({
    name: unit.name,
    primary: unit.primary,
    required: unit.required,
    options: unit.options.map(ShoppingSaleUnitOptionDiagnoser.replica),
    stocks: unit.stocks.map(
      ShoppingSaleUnitStockDiagnoser.replica(unit.options)
    ),
  });
}
