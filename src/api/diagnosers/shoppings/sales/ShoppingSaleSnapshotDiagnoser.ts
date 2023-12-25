import { IDiagnosis } from "@samchon/shopping-api/lib/structures/common/IDiagnosis";
import { IShoppingSaleChannel } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleChannel";
import { IShoppingSaleSnapshot } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleSnapshot";
import { IShoppingSaleUnit } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnit";

import { UniqueDiagnoser } from "../../common/UniqueDiagnoser";
import { ShoppingSaleChannelDiagnoser } from "./ShoppingSaleChannelDiagnoser";
import { ShoppingSaleContentDiagnoser } from "./ShoppingSaleContentDiagnoser";
import { ShoppingSaleUnitDiagnoser } from "./ShoppingSaleUnitDiagnoser";

export namespace ShoppingSaleSnapshotDiagnoser {
  export const validate = (
    sale: IShoppingSaleSnapshot.ICreate,
    checkUnits: boolean = true,
  ): IDiagnosis[] => {
    const output: IDiagnosis[] = [];

    // CHANNELS
    output.push(
      ...UniqueDiagnoser.validate<IShoppingSaleChannel.ICreate>({
        key: (c) => c.code,
        message: (c, i) => ({
          accessor: `input.channels[${i}]`,
          message: `Duplicated channel code: "${c.code}"`,
        }),
      })(sale.channels),
    );
    sale.channels.forEach((channel, i) =>
      output.push(
        ...ShoppingSaleChannelDiagnoser.validate({
          data: channel,
          index: i,
        }),
      ),
    );

    // UNITS
    if (checkUnits === true) {
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
        })(sale.units),
      );
      sale.units.forEach((unit, i) =>
        output.push(
          ...ShoppingSaleUnitDiagnoser.validate({ data: unit, index: i }),
        ),
      );
    }

    // PROPERTIES
    output.push(
      ...UniqueDiagnoser.validate<string>({
        key: (str) => str,
        message: (str, i) => ({
          accessor: `input.tags[${i}]`,
          message: `Duplicated tags: "${str}"`,
        }),
      })(sale.tags),
    );
    return output;
  };

  export const replica = (
    snapshot: IShoppingSaleSnapshot,
  ): IShoppingSaleSnapshot.ICreate => ({
    channels: snapshot.channels.map(ShoppingSaleChannelDiagnoser.replica),
    content: ShoppingSaleContentDiagnoser.replica(snapshot.content),
    units: snapshot.units.map(ShoppingSaleUnitDiagnoser.replica),
    tags: snapshot.tags.slice(),
  });
}