import { Prisma } from "@prisma/sdk";
import { v4 } from "uuid";

import { IShoppingSaleUnitStock } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitStock";

import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingSaleSnapshotUnitOptionProvider } from "./ShoppingSaleSnapshotUnitOptionProvider";
import { ShoppingSaleSnapshotUnitStockChoiceProvider } from "./ShoppingSaleSnapshotUnitStockChoiceProvider";

export namespace ShoppingSaleSnapshotUnitStockProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_sale_snapshot_unit_stocksGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingSaleUnitStock => {
      if (input.mv_inventory === null)
        throw ErrorProvider.internal("No inventory status exists.");
      return {
        id: input.id,
        name: input.name,
        choices: input.choices
          .sort((a, b) => a.sequence - b.sequence)
          .map(ShoppingSaleSnapshotUnitStockChoiceProvider.json.transform),
        inventory: {
          income: input.mv_inventory.income,
          outcome: input.mv_inventory.outcome,
        },
        price: {
          nominal: input.nominal_price,
          real: input.real_price,
        },
      };
    };
    export const select = () =>
      ({
        include: {
          choices: ShoppingSaleSnapshotUnitStockChoiceProvider.json.select(),
          mv_inventory: true,
        },
      }) satisfies Prisma.shopping_sale_snapshot_unit_stocksFindManyArgs;
  }

  export const collect = (props: {
    options: ReturnType<
      typeof ShoppingSaleSnapshotUnitOptionProvider.collect
    >[];
    input: IShoppingSaleUnitStock.ICreate;
    sequence: number;
  }) =>
    ({
      id: v4(),
      name: props.input.name,
      sequence: props.sequence,
      choices: {
        create: props.input.choices.map((value, i) =>
          ShoppingSaleSnapshotUnitStockChoiceProvider.collect({
            options: props.options,
            input: value,
            sequence: i,
          }),
        ),
      },
      real_price: props.input.price.real,
      nominal_price: props.input.price.nominal,
      quantity: props.input.quantity,
      mv_inventory: {
        create: {
          income: props.input.quantity,
          outcome: 0,
        },
      },
    }) satisfies Prisma.shopping_sale_snapshot_unit_stocksCreateWithoutUnitInput;
}
