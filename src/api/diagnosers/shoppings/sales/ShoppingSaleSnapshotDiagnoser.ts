import { IDiagnosis } from "../../../structures/common/IDiagnosis";
import { IShoppingSaleSnapshot } from "../../../structures/shoppings/sales/IShoppingSaleSnapshot";
import { IShoppingSaleUnit } from "../../../structures/shoppings/sales/IShoppingSaleUnit";
import { UniqueDiagnoser } from "../../common/UniqueDiagnoser";
import { ShoppingSaleContentDiagnoser } from "./ShoppingSaleContentDiagnoser";
import { ShoppingSaleUnitDiagnoser } from "./ShoppingSaleUnitDiagnoser";

export namespace ShoppingSaleSnapshotDiagnoser {
  export const validate = (
    sale: IShoppingSaleSnapshot.ICreate,
  ): IDiagnosis[] => {
    const output: IDiagnosis[] = [];

    // CATEGORIES
    output.push(
      ...UniqueDiagnoser.validate<string>({
        key: (c) => c,
        message: (c, i) => ({
          accessor: `input.category_codes[${i}]`,
          message: `Duplicated category code: "${c}"`,
        }),
        items: sale.category_codes,
      }),
    );

    // UNITS
    if (sale.units.length === 0)
      output.push({
        accessor: "input.units",
        message: "No unit",
      });
    else if (sale.units.every((u) => u.required === false))
      output.push({
        accessor: "input.units[].required",
        message: "No required unit",
      });
    output.push(
      ...UniqueDiagnoser.validate<IShoppingSaleUnit.ICreate>({
        key: (u) => u.name,
        message: (u, i) => ({
          accessor: `input.units[${i}]`,
          message: `Duplicated unit name: "${u.name}"`,
        }),
        items: sale.units,
      }),
    );
    sale.units.forEach((unit, i) =>
      output.push(
        ...ShoppingSaleUnitDiagnoser.validate({
          unit: unit,
          index: i,
        }),
      ),
    );

    // PROPERTIES
    output.push(
      ...UniqueDiagnoser.validate<string>({
        key: (str) => str,
        message: (str, i) => ({
          accessor: `input.tags[${i}]`,
          message: `Duplicated tags: "${str}"`,
        }),
        items: sale.tags,
      }),
    );
    return output;
  };

  export const replica = (
    snapshot: IShoppingSaleSnapshot,
  ): IShoppingSaleSnapshot.ICreate => ({
    category_codes: snapshot.categories.map((c) => c.code),
    content: ShoppingSaleContentDiagnoser.replica(snapshot.content),
    units: snapshot.units.map(ShoppingSaleUnitDiagnoser.replica),
    tags: snapshot.tags.slice(),
  });
}
