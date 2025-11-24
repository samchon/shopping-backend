import { Prisma } from "@prisma/sdk";
import typia from "typia";
import { v4 } from "uuid";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingMileage } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileage";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { PaginationUtil } from "../../../utils/PaginationUtil";

export namespace ShoppingMileageProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_mileagesGetPayload<ReturnType<typeof select>>,
    ): IShoppingMileage => ({
      id: input.id,
      code: input.code,
      source: input.source,
      value: input.value,
      direction: typia.assert<IShoppingMileage.Direction>(input.direction),
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({}) satisfies Prisma.shopping_mileagesFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
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
    input: IShoppingMileage.IRequest.ISearch | null | undefined,
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
      ...(input?.direction !== undefined && input?.direction !== null
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

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create = async (props: {
    admin: null | IShoppingAdministrator.IInvert;
    input: IShoppingMileage.ICreate;
  }): Promise<IShoppingMileage> => {
    const record = await ShoppingGlobal.prisma.shopping_mileages.create({
      data: {
        id: v4(),
        code: props.input.code,
        source: props.input.source,
        value: props.input.value,
        direction: props.input.direction,
        created_at: new Date(),
      },
      ...json.select(),
    });
    return json.transform(record);
  };

  export const erase = async (props: {
    admin: IShoppingAdministrator.IInvert;
    id: string;
  }): Promise<void> => {
    await ShoppingGlobal.prisma.shopping_mileages.findFirstOrThrow({
      where: { id: props.id },
    });

    const count: number =
      await ShoppingGlobal.prisma.shopping_mileage_histories.count({
        where: {
          shopping_mileage_id: props.id,
        },
      });
    if (count !== 0)
      throw ErrorProvider.gone({
        accessor: "id",
        message:
          "Cannot erase the mileage because it already has some histories.",
      });
    await ShoppingGlobal.prisma.shopping_mileages.delete({
      where: { id: props.id },
    });
  };
}
