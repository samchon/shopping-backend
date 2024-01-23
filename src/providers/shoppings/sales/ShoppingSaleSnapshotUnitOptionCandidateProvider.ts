import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IShoppingSaleUnitOptionCandidate } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitOptionCandidate";

export namespace ShoppingSaleSnapshotUnitOptionCandidateProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_sale_snapshot_unit_option_candidatesGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingSaleUnitOptionCandidate => ({
      id: input.id,
      name: input.name,
    });
    export const select = () =>
      ({}) satisfies Prisma.shopping_sale_snapshot_unit_option_candidatesFindManyArgs;
  }

  export const collect = (
    input: IShoppingSaleUnitOptionCandidate.ICreate,
    sequence: number,
  ) =>
    ({
      id: v4(),
      name: input.name,
      sequence,
    }) satisfies Prisma.shopping_sale_snapshot_unit_option_candidatesCreateWithoutOptionInput;
}
