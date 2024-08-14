import { IDiagnosis } from "../../../structures/common/IDiagnosis";
import { IShoppingSaleUnit } from "../../../structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitOption } from "../../../structures/shoppings/sales/IShoppingSaleUnitOption";
import { IShoppingSaleUnitStock } from "../../../structures/shoppings/sales/IShoppingSaleUnitStock";
import { IShoppingSaleUnitStockChoice } from "../../../structures/shoppings/sales/IShoppingSaleUnitStockChoice";

import { IIndexedInput } from "../../common/IIndexedInput";

export namespace ShoppingSaleUnitStockChoiceDiagnoser {
  export const validate =
    (unit: IIndexedInput<IShoppingSaleUnit.ICreate>) =>
    (stock: IIndexedInput<IShoppingSaleUnitStock.ICreate>) =>
    (
      choice: IIndexedInput<IShoppingSaleUnitStockChoice.ICreate>,
    ): IDiagnosis[] => {
      const accessor: string = `input.units.[${unit.index}].stocks[${stock.index}].choices[${choice.index}]`;
      const output: IDiagnosis[] = [];

      const option: IShoppingSaleUnitOption.ICreate | undefined =
        unit.data.options[choice.data.option_index];
      if (option === undefined) {
        output.push({
          accessor,
          message: `Option index ${choice.data.option_index} is out of bounds.`,
        });
      } else if (option.type !== "select")
        output.push({
          accessor,
          message: `Option type must be "select".`,
        });
      else if (option.variable === false)
        output.push({
          accessor,
          message: `Option is not variable.`,
        });
      else if (option.candidates[choice.data.candidate_index] === undefined)
        output.push({
          accessor,
          message: `Candidate index ${choice.data.candidate_index} is out of bounds.`,
        });
      return output;
    };

  export const replica =
    (options: IShoppingSaleUnitOption[]) =>
    (
      input: IShoppingSaleUnitStockChoice,
    ): IShoppingSaleUnitStockChoice.ICreate => {
      const optionIndex: number = options.findIndex(
        (o) => o.id === input.option_id,
      );
      if (optionIndex === -1)
        throw new Error(
          "Error on ShoppingSaleUnitStockChoiceDiagnoser.replica(): unable to find the matched option.",
        );

      const option: IShoppingSaleUnitOption = options[optionIndex];
      if (option.type !== "select")
        throw new Error(
          "Error on ShoppingSaleUnitStockChoiceDiagnoser.replica(): option type must be 'select'.",
        );
      else if (option.variable === false)
        throw new Error(
          "Error on ShoppingSaleUnitStockChoiceDiagnoser.replica(): option must be variable.",
        );

      const candidateIndex: number = option.candidates.findIndex(
        (c) => c.id === input.candidate_id,
      );
      if (candidateIndex === -1)
        throw new Error(
          "Error on ShoppingSaleUnitStockChoiceDiagnoser.replica(): unable to find the matched candidate.",
        );
      return {
        option_index: optionIndex,
        candidate_index: candidateIndex,
      };
    };
}
