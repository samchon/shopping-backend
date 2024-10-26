import { IDiagnosis } from "../../../structures/common/IDiagnosis";
import { IShoppingSaleUnit } from "../../../structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitOption } from "../../../structures/shoppings/sales/IShoppingSaleUnitOption";
import { IShoppingSaleUnitOptionCandidate } from "../../../structures/shoppings/sales/IShoppingSaleUnitOptionCandidate";

import { UniqueDiagnoser } from "../../common/UniqueDiagnoser";

export namespace ShoppingSaleUnitOptionDiagnoser {
  export const validate = (props: {
    unit: IShoppingSaleUnit.ICreate;
    unitIndex: number;
    option: IShoppingSaleUnitOption.ICreate;
    index: number;
  }): IDiagnosis[] => {
    if (props.option.type !== "select") return [];

    const accessor: string = `input.units[${props.unitIndex}].options[${props.index}]`;
    const output: IDiagnosis[] = [];

    if (props.option.candidates.length === 0)
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
        items: props.option.candidates,
      })
    );
    return output;
  };

  export const replica = (
    input: IShoppingSaleUnitOption
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
