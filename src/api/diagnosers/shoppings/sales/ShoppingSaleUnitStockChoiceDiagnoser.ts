import { IDiagnosis } from "../../../structures/common/IDiagnosis";
import { IShoppingSaleUnit } from "../../../structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitOption } from "../../../structures/shoppings/sales/IShoppingSaleUnitOption";
import { IShoppingSaleUnitStock } from "../../../structures/shoppings/sales/IShoppingSaleUnitStock";
import { IShoppingSaleUnitStockChoice } from "../../../structures/shoppings/sales/IShoppingSaleUnitStockChoice";

export namespace ShoppingSaleUnitStockChoiceDiagnoser {
  export const validate = (props: {
    unit: IShoppingSaleUnit.ICreate;
    unitIndex: number;
    stock: IShoppingSaleUnitStock.ICreate;
    stockIndex: number;
    choice: IShoppingSaleUnitStockChoice.ICreate;
    index: number;
  }): IDiagnosis[] => {
    const accessor: string = `input.units.[${props.unitIndex}].stocks[${props.stockIndex}].choices[${props.index}]`;
    const output: IDiagnosis[] = [];

    const option: IShoppingSaleUnitOption.ICreate | undefined =
      props.unit.options[props.choice.option_index];
    if (option === undefined) {
      output.push({
        accessor,
        message: `Option index ${props.choice.option_index} is out of bounds.`,
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
    else if (option.candidates[props.choice.candidate_index] === undefined)
      output.push({
        accessor,
        message: `Candidate index ${props.choice.candidate_index} is out of bounds.`,
      });
    return output;
  };

  export const replica = (props: {
    options: IShoppingSaleUnitOption[];
    choice: IShoppingSaleUnitStockChoice;
  }): IShoppingSaleUnitStockChoice.ICreate => {
    const optionIndex: number = props.options.findIndex(
      (o) => o.id === props.choice.option_id
    );
    if (optionIndex === -1)
      throw new Error(
        "Error on ShoppingSaleUnitStockChoiceDiagnoser.replica(): unable to find the matched option."
      );

    const option: IShoppingSaleUnitOption = props.options[optionIndex];
    if (option.type !== "select")
      throw new Error(
        "Error on ShoppingSaleUnitStockChoiceDiagnoser.replica(): option type must be 'select'."
      );
    else if (option.variable === false)
      throw new Error(
        "Error on ShoppingSaleUnitStockChoiceDiagnoser.replica(): option must be variable."
      );

    const candidateIndex: number = option.candidates.findIndex(
      (c) => c.id === props.choice.candidate_id
    );
    if (candidateIndex === -1)
      throw new Error(
        "Error on ShoppingSaleUnitStockChoiceDiagnoser.replica(): unable to find the matched candidate."
      );
    return {
      option_index: optionIndex,
      candidate_index: candidateIndex,
    };
  };
}
