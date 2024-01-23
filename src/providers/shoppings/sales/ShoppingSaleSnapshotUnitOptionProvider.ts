import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IShoppingSaleUnitOption } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitOption";

import { ShoppingSaleSnapshotUnitOptionCandidateProvider } from "./ShoppingSaleSnapshotUnitOptionCandidateProvider";

export namespace ShoppingSaleSnapshotUnitOptionProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_sale_snapshot_unit_optionsGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingSaleUnitOption =>
      input.type === "select"
        ? {
            id: input.id,
            type: "select",
            name: input.name,
            variable: input.variable,
            candidates: input.candidates
              .sort((a, b) => a.sequence - b.sequence)
              .map(
                ShoppingSaleSnapshotUnitOptionCandidateProvider.json.transform,
              ),
          }
        : {
            id: input.id,
            type: input.type as "string",
            name: input.name,
          };
    export const select = () =>
      ({
        include: {
          candidates:
            ShoppingSaleSnapshotUnitOptionCandidateProvider.json.select(),
        },
      }) satisfies Prisma.shopping_sale_snapshot_unit_optionsFindManyArgs;
  }

  export const collect = (
    input: IShoppingSaleUnitOption.ICreate,
    sequence: number,
  ) =>
    ({
      id: v4(),
      name: input.name,
      type: input.type,
      variable: input.type === "select" ? input.variable : false,
      candidates: {
        create:
          input.type === "select"
            ? input.candidates.map(
                ShoppingSaleSnapshotUnitOptionCandidateProvider.collect,
              )
            : [],
      },
      sequence,
    }) satisfies Prisma.shopping_sale_snapshot_unit_optionsCreateWithoutUnitInput;
}
