import { IDiagnosis } from "../../../structures/common/IDiagnosis";
import { IShoppingCartCommodityStockChoice } from "../../../structures/shoppings/orders/IShoppingCartCommodityStockChoice";
import { IShoppingSaleUnit } from "../../../structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitOption } from "../../../structures/shoppings/sales/IShoppingSaleUnitOption";
import { IShoppingSaleUnitStockChoice } from "../../../structures/shoppings/sales/IShoppingSaleUnitStockChoice";

export namespace ShoppingCartCommodityStockChoiceDiagnoser {
  export const validate = (props: {
    unit: IShoppingSaleUnit;
    stockIndex: number;
    input: IShoppingCartCommodityStockChoice.ICreate;
    index: number;
  }): IDiagnosis[] => {
    const output: IDiagnosis[] = [];
    const option: IShoppingSaleUnitOption | undefined = props.unit.options.find(
      (o) => o.id === props.input.option_id
    );
    if (option === undefined)
      output.push({
        accessor: `items[${props.stockIndex}].choices[${props.index}].option_id`,
        message: `Unable to find the matched option.`,
      });
    else {
      // SELECT TYPE OPTION
      if (option.type === "select") {
        if (props.input.value !== null)
          output.push({
            accessor: `items[${props.stockIndex}].choices[${props.index}].value`,
            message: `The value is not required for the select option.`,
          });
        if (props.input.candidate_id === null)
          output.push({
            accessor: `items[${props.stockIndex}].choices[${props.index}].candidate_id`,
            message: `The candidate_id is required for the select option.`,
          });
        else {
          const candidate = option.candidates.find(
            (o) => o.id === props.input.candidate_id
          );
          if (candidate === undefined)
            output.push({
              accessor: `items[${props.stockIndex}].choices[${props.index}].candidate_id`,
              message: `Unable to find the matched candidate.`,
            });
        }
      } else {
        if (props.input.candidate_id !== null)
          output.push({
            accessor: `items[${props.stockIndex}].choices[${props.index}].candidate_id`,
            message: `The candidate_id is not required for the ${option.type} option.`,
          });
        else if (props.input.value !== null) {
          if (
            option.type === "boolean" &&
            typeof props.input.value !== "boolean"
          )
            output.push({
              accessor: `items[${props.stockIndex}].choices[${props.index}].value`,
              message: `The value must be boolean type.`,
            });
          else if (
            option.type === "number" &&
            typeof props.input.value !== "number"
          )
            output.push({
              accessor: `items[${props.stockIndex}].choices[${props.index}].value`,
              message: `The value must be number type.`,
            });
          else if (
            option.type === "string" &&
            typeof props.input.value !== "string"
          )
            output.push({
              accessor: `items[${props.stockIndex}].choices[${props.index}].value`,
              message: `The value must be string type.`,
            });
        }
      }
    }
    return output;
  };

  export const replica = (
    choice: IShoppingSaleUnitStockChoice.IInvert
  ): IShoppingCartCommodityStockChoice.ICreate => ({
    option_id: choice.option.id,
    candidate_id: choice.candidate?.id ?? null,
    value: choice.value ?? null,
  });
}
