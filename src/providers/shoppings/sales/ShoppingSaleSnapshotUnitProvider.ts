import { Prisma } from "@prisma/client";

import { IShoppingSaleUnit } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnit";

import { ShoppingSaleSnapshotUnitOptionProvider } from "./ShoppingSaleSnapshotUnitOptionProvider";
import { ShoppingSaleSnapshotUnitStockProvider } from "./ShoppingSaleSnapshotUnitStockProvider";
import { v4 } from "uuid";

export namespace ShoppingSaleSnapshotUnitProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_sale_snapshot_unitsGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingSaleUnit => ({
      id: input.id,
      name: input.name,
      primary: input.primary,
      required: input.required,
      options: input.options
        .sort((a, b) => a.sequence - b.sequence)
        .map(ShoppingSaleSnapshotUnitOptionProvider.json.transform),
      stocks: input.stocks
        .sort((a, b) => a.sequence - b.sequence)
        .map(ShoppingSaleSnapshotUnitStockProvider.json.transform),
    });
    export const select = () => ({
      include: {
        options: ShoppingSaleSnapshotUnitOptionProvider.json.select(),
        stocks: ShoppingSaleSnapshotUnitStockProvider.json.select(),
      },
    } satisfies Prisma.shopping_sale_snapshot_unitsFindManyArgs);
  }

  export const collect = (
    input: IShoppingSaleUnit.ICreate,
    sequence: number,
  ) => {
    const options = input.options.map(ShoppingSaleSnapshotUnitOptionProvider.collect);
    return {
      id: v4(),
      name: input.name,
      primary: input.primary,
      required: input.required,
      options: {
        create: options,
      },
      stocks: {
        create: input.stocks.map(ShoppingSaleSnapshotUnitStockProvider.collect(options)),
      },
      sequence,
    } satisfies Prisma.shopping_sale_snapshot_unitsCreateWithoutSnapshotInput;
  }
}
