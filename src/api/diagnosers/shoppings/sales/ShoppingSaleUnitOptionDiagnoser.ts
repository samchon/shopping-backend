import { IDiagnosis } from "@samchon/shopping-api/lib/structures/common/IDiagnosis";
import { IShoppingSaleUnit } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitOption } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitOption";
import { IShoppingSaleUnitOptionCandidate } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitOptionCandidate";

import { IIndexedInput } from "../../common/IIndexedInput";
import { UniqueDiagnoser } from "../../common/UniqueDiagnoser";

export namespace ShoppingSaleUnitOptionDiagnoser {
  export const validate =
    (unit: IIndexedInput<IShoppingSaleUnit.ICreate>) =>
    (option: IIndexedInput<IShoppingSaleUnitOption.ICreate>): IDiagnosis[] => {
      if (option.data.type !== "select") return [];

      const accessor: string = `input.units[${unit.index}].options[${option.index}]`;
      const output: IDiagnosis[] = [];

      if (option.data.candidates.length === 0)
        output.push({
          accessor: `${accessor}.candidates`,
          message:
            'Candidates must not be empty when type of the option is "select".',
        });
      output.push(
        ...UniqueDiagnoser.validate<IShoppingSaleUnitOptionCandidate.ICreate>({
          key: (c) => c.name,
          message: (c, i) => ({
            accessor: `${accessor}.candidates[${i}]`,
            message: `Duplicated candidate name: "${c.name}"`,
          }),
        })(option.data.candidates),
      );
      return output;
    };

  export const replica = (
    input: IShoppingSaleUnitOption,
  ): IShoppingSaleUnitOption.ICreate =>
    input.type === "select"
      ? {
          type: input.type,
          name: input.name,
          variable: input.variable,
          candidates: input.candidates.map((c) => ({
            name: c.name,
          })),
        }
      : {
          type: input.type,
          name: input.name,
        };
}
