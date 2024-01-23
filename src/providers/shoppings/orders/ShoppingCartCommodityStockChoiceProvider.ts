import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IShoppingCartCommodityStockChoice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodityStockChoice";
import { IShoppingSaleUnitOption } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitOption";
import { IShoppingSaleUnitStockChoice } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitStockChoice";

import { ShoppingSaleSnapshotUnitOptionCandidateProvider } from "../sales/ShoppingSaleSnapshotUnitOptionCandidateProvider";

export namespace ShoppingCartCommodityStockChoiceProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_cart_commodity_stock_choicesGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingSaleUnitStockChoice.IInvert => {
      const option: IShoppingSaleUnitOption.IInvert =
        input.option.type === "select"
          ? {
              id: input.option.id,
              type: "select",
              name: input.option.name,
              variable: input.option.variable,
            }
          : {
              id: input.option.id,
              type: input.option.type as "string",
              name: input.option.name,
            };
      return {
        id: input.id,
        option:
          input.option.type === "select"
            ? {
                id: input.option.id,
                type: "select",
                name: input.option.name,
                variable: input.option.variable,
              }
            : {
                id: input.option.id,
                type: input.option.type as "string",
                name: input.option.name,
              },
        candidate:
          input.candidate !== null
            ? ShoppingSaleSnapshotUnitOptionCandidateProvider.json.transform(
                input.candidate,
              )
            : null,
        value:
          option.type === "select"
            ? null
            : option.type === "boolean"
              ? input.value === "boolean"
              : option.type === "number"
                ? Number(input.value)
                : input.value,
      };
    };
    export const select = () =>
      ({
        include: {
          option: true,
          candidate: true,
        },
      }) satisfies Prisma.shopping_cart_commodity_stock_choicesFindManyArgs;
  }

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const collect = (
    input: IShoppingCartCommodityStockChoice.ICreate,
    sequence: number,
  ) =>
    ({
      id: v4(),
      option: {
        connect: { id: input.option_id },
      },
      candidate:
        input.candidate_id !== null
          ? { connect: { id: input.candidate_id } }
          : undefined,
      value: input.value !== null ? String(input.value) : null,
      sequence,
    }) satisfies Prisma.shopping_cart_commodity_stock_choicesCreateWithoutStockInput;
}
