import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IShoppingSaleUnitStockChoice } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitStockChoice";

import { ShoppingSaleSnapshotUnitOptionProvider } from "./ShoppingSaleSnapshotUnitOptionProvider";

export namespace ShoppingSaleSnapshotUnitStockChoiceProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_sale_snapshot_unit_stock_choicesGetPayload<
        ReturnType<typeof select>
      >
    ): IShoppingSaleUnitStockChoice => ({
      id: input.id,
      option_id: input.shopping_sale_snapshot_unit_option_id,
      candidate_id: input.shopping_sale_snapshot_unit_option_candidate_id,
    });
    export const select = () =>
      ({}) satisfies Prisma.shopping_sale_snapshot_unit_stock_choicesFindManyArgs;
  }

  export const collect = (props: {
    options: ReturnType<
      typeof ShoppingSaleSnapshotUnitOptionProvider.collect
    >[];
    input: IShoppingSaleUnitStockChoice.ICreate;
    sequence: number;
  }) => {
    const option = props.options[props.input.option_index];
    const candidate = option.candidates.create[props.input.candidate_index];
    return {
      id: v4(),
      option: { connect: { id: option.id } },
      candidate: { connect: { id: candidate.id } },
      sequence: props.sequence,
    } satisfies Prisma.shopping_sale_snapshot_unit_stock_choicesCreateWithoutStockInput;
  };
}
