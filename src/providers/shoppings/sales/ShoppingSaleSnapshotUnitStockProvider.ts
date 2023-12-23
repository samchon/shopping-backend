import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IShoppingSaleUnitStock } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitStock";

import { ShoppingSaleSnapshotUnitOptionProvider } from "./ShoppingSaleSnapshotUnitOptionProvider";
import { ShoppingSaleSnapshotUnitStockChoiceProvider } from "./ShoppingSaleSnapshotUnitStockChoiceProvider";

export namespace ShoppingSaleSnapshotUnitStockProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_sale_snapshot_unit_stocksGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingSaleUnitStock => ({
      id: input.id,
      name: input.name,
      choices: input.choices
        .sort((a, b) => a.sequence - b.sequence)
        .map(ShoppingSaleSnapshotUnitStockChoiceProvider.json.transform),
      inventory: {
        income: input.mv_inventory!.income,
        outcome: input.mv_inventory!.outcome,
      },
      price: {
        nominal: input.nominal_price,
        real: input.real_price,
      },
    });
    export const select = () =>
      ({
        include: {
          choices: ShoppingSaleSnapshotUnitStockChoiceProvider.json.select(),
          mv_inventory: true,
        },
      } satisfies Prisma.shopping_sale_snapshot_unit_stocksFindManyArgs);
  }

  export const collect =
    (
      optionList: ReturnType<
        typeof ShoppingSaleSnapshotUnitOptionProvider.collect
      >[],
    ) =>
    (input: IShoppingSaleUnitStock.ICreate, sequence: number) =>
      ({
        id: v4(),
        name: input.name,
        sequence,
        choices: {
          create: input.choices.map(
            ShoppingSaleSnapshotUnitStockChoiceProvider.collect(optionList),
          ),
        },
        real_price: input.price.real,
        nominal_price: input.price.nominal,
        quantity: input.quantity,
        mv_inventory: {
          create: {
            income: input.quantity,
            outcome: 0,
          },
        },
      } satisfies Prisma.shopping_sale_snapshot_unit_stocksCreateWithoutUnitInput);
}
