import { Prisma } from "@prisma/client";
import typia from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingMileage } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileage";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { PaginationUtil } from "../../../utils/PaginationUtil";

export namespace ShoppingMileageProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_mileagesGetPayload<ReturnType<typeof select>>,
    ): IShoppingMileage => ({
      id: input.id,
      code: input.code,
      source: input.source,
      direction: typia.assert<IShoppingMileage.Direction>(input.direction),
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({} satisfies Prisma.shopping_mileagesFindManyArgs);
  }

  export const index = (
    input: IShoppingMileage.IRequest,
  ): Promise<IPage<IShoppingMileage>> =>
    PaginationUtil.paginate({
      schema: ShoppingGlobal.prisma.shopping_mileages,
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
    input: IShoppingMileage.IRequest.ISearch | undefined,
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
    ] satisfies Prisma.shopping_mileagesWhereInput["AND"];

  export const orderBy = (
    key: IShoppingMileage.IRequest.SortableColumns,
    value: "asc" | "desc",
  ) =>
    (key === "mileage.code"
      ? { code: value }
      : key === "mileage.source"
      ? { source: value }
      : {
          direction: value,
        }) satisfies Prisma.shopping_mileagesOrderByWithRelationInput;

  export const at = async (id: string): Promise<IShoppingMileage> => {
    const record =
      await ShoppingGlobal.prisma.shopping_mileages.findFirstOrThrow({
        where: { id },
      });
    return json.transform(record);
  };

  export const get = async (code: string): Promise<IShoppingMileage> => {
    const record =
      await ShoppingGlobal.prisma.shopping_mileages.findFirstOrThrow({
        where: { code },
      });
    return json.transform(record);
  };
}
