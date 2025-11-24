import { Prisma } from "@prisma/sdk";
import { v4 } from "uuid";

import { IShoppingPrice } from "@samchon/shopping-api/lib/structures/shoppings/base/IShoppingPrice";
import { IShoppingSaleUnit } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnit";

import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingSaleSnapshotUnitOptionProvider } from "./ShoppingSaleSnapshotUnitOptionProvider";
import { ShoppingSaleSnapshotUnitStockProvider } from "./ShoppingSaleSnapshotUnitStockProvider";

export namespace ShoppingSaleSnapshotUnitProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace summary {
    export const transform = (
      input: Prisma.shopping_sale_snapshot_unitsGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingSaleUnit.ISummary => {
      if (input.mv_price_range === null)
        throw ErrorProvider.internal(
          "No price mv_shopping_sale_snapshot_unit_prices record found.",
        );
      return {
        id: input.id,
        name: input.name,
        primary: input.primary,
        required: input.required,
        price_range: {
          lowest: {
            real: input.mv_price_range.real_lowest,
            nominal: input.mv_price_range.nominal_lowest,
          },
          highest: {
            real: input.mv_price_range.real_highest,
            nominal: input.mv_price_range.nominal_highest,
          },
        },
      };
    };
    export const select = () =>
      ({
        include: {
          mv_price_range: true,
        },
      }) satisfies Prisma.shopping_sale_snapshot_unitsFindManyArgs;
  }

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
    export const select = () =>
      ({
        include: {
          options: ShoppingSaleSnapshotUnitOptionProvider.json.select(),
          stocks: ShoppingSaleSnapshotUnitStockProvider.json.select(),
        },
      }) satisfies Prisma.shopping_sale_snapshot_unitsFindManyArgs;
  }

  export namespace invert {
    export const transform = (
      input: Prisma.shopping_sale_snapshot_unitsGetPayload<
        ReturnType<typeof select>
      >,
    ): Omit<IShoppingSaleUnit.IInvert, "stocks"> => ({
      id: input.id,
      name: input.name,
      primary: input.primary,
      required: input.required,
    });
    export const select = () =>
      ({}) satisfies Prisma.shopping_sale_snapshot_unitsFindManyArgs;
  }

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const collect = (
    input: IShoppingSaleUnit.ICreate,
    sequence: number,
  ) => {
    const options = input.options.map(
      ShoppingSaleSnapshotUnitOptionProvider.collect,
    );
    return {
      id: v4(),
      name: input.name,
      primary: input.primary,
      required: input.required,
      options: {
        create: options,
      },
      stocks: {
        create: input.stocks.map((v, i) =>
          ShoppingSaleSnapshotUnitStockProvider.collect({
            options,
            input: v,
            sequence: i,
          }),
        ),
      },
      mv_price_range: {
        create: collectPriceRange(input),
      },
      sequence,
    } satisfies Prisma.shopping_sale_snapshot_unitsCreateWithoutSnapshotInput;
  };

  const collectPriceRange = (input: IShoppingSaleUnit.ICreate) => {
    const computer =
      (picker: (p: IShoppingPrice) => number) =>
      (best: (...args: number[]) => number) =>
        best(...input.stocks.map((s) => picker(s.price)));
    return {
      nominal_lowest: computer((p) => p.nominal)(Math.min),
      real_lowest: computer((p) => p.real)(Math.min),
      real_highest: computer((p) => p.real)(Math.max),
      nominal_highest: computer((p) => p.nominal)(Math.max),
    } satisfies Prisma.mv_shopping_sale_snapshot_unit_pricesCreateWithoutUnitInput;
  };
}
