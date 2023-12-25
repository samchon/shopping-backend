import { IDiagnosis } from "@samchon/shopping-api/lib/structures/common/IDiagnosis";
import { IShoppingCartCommodityStockChoice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodityStockChoice";
import { IShoppingSaleUnit } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingSaleUnitOption } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitOption";
import { IShoppingSaleUnitStockChoice } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitStockChoice";

import { IIndexedInput } from "../../common/IIndexedInput";

export namespace ShoppingCartCommodityStockChoiceDiagnoser {
  export const validate =
    (unit: IShoppingSaleUnit) =>
    (stockIndex: number) =>
    (
      input: IIndexedInput<IShoppingCartCommodityStockChoice.ICreate>,
    ): IDiagnosis[] => {
      const output: IDiagnosis[] = [];
      const option: IShoppingSaleUnitOption | undefined = unit.options.find(
        (o) => o.id === input.data.option_id,
      );
      if (option === undefined)
        output.push({
          accessor: `items[${stockIndex}].choices[${input.index}].option_id`,
          message: `Unable to find the matched option.`,
        });
      else {
        // SELECT TYPE OPTION
        if (option.type === "select") {
          if (input.data.value !== null)
            output.push({
              accessor: `items[${stockIndex}].choices[${input.index}].value`,
              message: `The value is not required for the select option.`,
            });
          if (input.data.candidate_id === null)
            output.push({
              accessor: `items[${stockIndex}].choices[${input.index}].candidate_id`,
              message: `The candidate_id is required for the select option.`,
            });
          else {
            const candidate = option.candidates.find(
              (o) => o.id === input.data.candidate_id,
            );
            if (candidate === undefined)
              output.push({
                accessor: `items[${stockIndex}].choices[${input.index}].candidate_id`,
                message: `Unable to find the matched candidate.`,
              });
          }
        } else {
          if (input.data.candidate_id !== null)
            output.push({
              accessor: `items[${stockIndex}].choices[${input.index}].candidate_id`,
              message: `The candidate_id is not required for the ${option.type} option.`,
            });
          else if (input.data.value !== null) {
            if (
              option.type === "boolean" &&
              typeof input.data.value !== "boolean"
            )
              output.push({
                accessor: `items[${stockIndex}].choices[${input.index}].value`,
                message: `The value must be boolean type.`,
              });
            else if (
              option.type === "number" &&
              typeof input.data.value !== "number"
            )
              output.push({
                accessor: `items[${stockIndex}].choices[${input.index}].value`,
                message: `The value must be number type.`,
              });
            else if (
              option.type === "string" &&
              typeof input.data.value !== "string"
            )
              output.push({
                accessor: `items[${stockIndex}].choices[${input.index}].value`,
                message: `The value must be string type.`,
              });
          }
        }
      }
      return output;
    };

  export const replica = (
    choice: IShoppingSaleUnitStockChoice.IInvert,
  ): IShoppingCartCommodityStockChoice.ICreate => ({
    option_id: choice.option.id,
    candidate_id: choice.candidate?.id ?? null,
    value: choice.value ?? null,
  });
}
