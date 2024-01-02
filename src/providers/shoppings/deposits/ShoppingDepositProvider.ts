import { Prisma } from "@prisma/client";
import typia from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingDeposit } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDeposit";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { PaginationUtil } from "../../../utils/PaginationUtil";

export namespace ShoppingDepositProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_depositsGetPayload<ReturnType<typeof select>>,
    ): IShoppingDeposit => ({
      id: input.id,
      code: input.code,
      source: input.source,
      direction: typia.assert<IShoppingDeposit.Direction>(input.direction),
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({} satisfies Prisma.shopping_depositsFindManyArgs);
  }

  export const index = (
    input: IShoppingDeposit.IRequest,
  ): Promise<IPage<IShoppingDeposit>> =>
    PaginationUtil.paginate({
      schema: ShoppingGlobal.prisma.shopping_deposits,
      payload: json.select(),
      transform: json.transform,
    })({
      where: search(input.search),
      orderBy: input.sort?.length
        ? PaginationUtil.orderBy(orderBy)(input.sort)
        : [
            {
              created_at: "desc",
            },
          ],
    })(input);

  export const search = (
    input: IShoppingDeposit.IRequest.ISearch | undefined,
  ) =>
    [
      ...(input?.source?.length
        ? [
            {
              source: {
                contains: input.source,
              },
            },
          ]
        : []),
      ...(input?.code?.length
        ? [
            {
              code: {
                contains: input.code,
              },
            },
          ]
        : []),
      ...(input?.direction !== undefined
        ? [
            {
              direction: input.direction,
            },
          ]
        : []),
    ] satisfies Prisma.shopping_depositsWhereInput["AND"];

  export const orderBy = (
    key: IShoppingDeposit.IRequest.SortableColumns,
    value: "asc" | "desc",
  ) =>
    (key === "deposit.code"
      ? { code: value }
      : key === "deposit.source"
      ? { source: value }
      : {
          direction: value,
        }) satisfies Prisma.shopping_depositsOrderByWithRelationInput;

  export const at = async (id: string): Promise<IShoppingDeposit> => {
    const record =
      await ShoppingGlobal.prisma.shopping_deposits.findFirstOrThrow({
        where: { id },
      });
    return json.transform(record);
  };

  export const get = async (code: string): Promise<IShoppingDeposit> => {
    const record =
      await ShoppingGlobal.prisma.shopping_deposits.findFirstOrThrow({
        where: { code },
      });
    return json.transform(record);
  };
}
