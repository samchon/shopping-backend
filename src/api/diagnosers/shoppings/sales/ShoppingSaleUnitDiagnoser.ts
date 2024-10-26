import { IDiagnosis } from "../../../structures/common/IDiagnosis";
import { IShoppingSaleUnit } from "../../../structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitOption } from "../../../structures/shoppings/sales/IShoppingSaleUnitOption";
import { IShoppingSaleUnitStock } from "../../../structures/shoppings/sales/IShoppingSaleUnitStock";

import { UniqueDiagnoser } from "../../common/UniqueDiagnoser";
import { ShoppingSaleUnitOptionDiagnoser } from "./ShoppingSaleUnitOptionDiagnoser";
import { ShoppingSaleUnitStockDiagnoser } from "./ShoppingSaleUnitStockDiagnoser";

export namespace ShoppingSaleUnitDiagnoser {
  export const validate = (props: {
    unit: IShoppingSaleUnit.ICreate;
    index: number;
  }): IDiagnosis[] => {
    const accessor: string = `input.units[${props.index}]`;
    const output: IDiagnosis[] = [];

    // OPTIONS
    output.push(
      ...UniqueDiagnoser.validate<IShoppingSaleUnitOption.ICreate>({
        key: (s) => s.name,
        message: (o, i) => ({
          accessor: `${accessor}.options[${i}]`,
          message: `Duplicated option name: "${o.name}"`,
        }),
        items: props.unit.options,
      })
    );
    props.unit.options.forEach((option, i) =>
      output.push(
        ...ShoppingSaleUnitOptionDiagnoser.validate({
          unit: props.unit,
          unitIndex: props.index,
          option: option,
          index: i,
        })
      )
    );

    // STOCKS
    if (props.unit.stocks.length === 0)
      output.push({
        accessor: `${accessor}.stocks.length`,
        message: "No stock exists.",
      });
    else {
      const count: number = props.unit.options
        .map((o) =>
          o.type === "select" && o.variable ? o.candidates.length : 1
        )
        .reduce((a, b) => a * b, 1);
      if (props.unit.stocks.length > count)
        output.push({
          accessor: `${accessor}.stocks.length`,
          message: `Incorrect number of stocks: must not over the ${count} but ${props.unit.stocks.length}.`,
        });
    }
    output.push(
      ...UniqueDiagnoser.validate<IShoppingSaleUnitStock.ICreate>({
        key: (s) => s.name,
        message: (o, i) => ({
          accessor: `${accessor}.stocks[${i}]`,
          message: `Duplicated stock name: "${o.name}"`,
        }),
        items: props.unit.stocks,
      })
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
    stocks: unit.stocks.map((stock) =>
      ShoppingSaleUnitStockDiagnoser.replica({
        options: unit.options,
        stock,
      })
    ),
  });
}
