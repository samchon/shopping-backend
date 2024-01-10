import { ArrayUtil } from "@nestia/e2e";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IRecordMerge } from "@samchon/shopping-api/lib/structures/common/IRecordMerge";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { PaginationUtil } from "../../../utils/PaginationUtil";
import { EntityMergeProvider } from "../../common/EntityMergeProvider";
import { ShoppingChannelCategoryProvider } from "./ShoppingChannelCategoryProvider";

export namespace ShoppingChannelProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_channelsGetPayload<ReturnType<typeof select>>,
    ): IShoppingChannel => ({
      id: input.id,
      code: input.code,
      name: input.name,
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({} satisfies Prisma.shopping_channelsFindManyArgs);
  }

  export const hierarchical = async (
    input: IShoppingChannel.IRequest,
  ): Promise<IPage<IShoppingChannel.IHierarchical>> => {
    const page = await index(input);
    return {
      ...page,
      data: await ArrayUtil.asyncMap(page.data)(async (channel) => ({
        ...channel,
        categories: await ShoppingChannelCategoryProvider.hierarchical.entire(
          channel,
        ),
      })),
    };
  };

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index = (
    input: IShoppingChannel.IRequest,
  ): Promise<IPage<IShoppingChannel>> =>
    PaginationUtil.paginate({
      schema: ShoppingGlobal.prisma.shopping_channels,
      payload: json.select(),
      transform: json.transform,
    })({
      where: {
        AND: search(input.search),
      },
      orderBy: input.sort?.length
        ? PaginationUtil.orderBy(orderBy)(input.sort)
        : [{ created_at: "asc" }],
    })(input);

  export const search = (
    input: IShoppingChannel.IRequest.ISearch | undefined,
  ) =>
    [
      ...(input?.code?.length
        ? [
            {
              code: {
                contains: input.code,
              },
            },
          ]
        : []),
      ...(input?.name?.length
        ? [
            {
              name: {
                contains: input.name,
                mode: "insensitive" as const,
              },
            },
          ]
        : []),
    ] satisfies Prisma.shopping_channelsWhereInput["AND"];

  export const orderBy = (
    key: IShoppingChannel.IRequest.SortableColumns,
    value: "asc" | "desc",
  ) =>
    (key === "channel.code"
      ? { code: value }
      : key === "channel.name"
      ? { name: value }
      : {
          created_at: value,
        }) satisfies Prisma.shopping_channelsOrderByWithRelationInput;

  export const at = async (
    id: string,
  ): Promise<IShoppingChannel.IHierarchical> => {
    const record =
      await ShoppingGlobal.prisma.shopping_channels.findFirstOrThrow({
        where: { id },
      });
    return {
      ...json.transform(record),
      categories: await ShoppingChannelCategoryProvider.hierarchical.entire(
        record,
      ),
    };
  };

  export const get = async (
    code: string,
  ): Promise<IShoppingChannel.IHierarchical> => {
    const record =
      await ShoppingGlobal.prisma.shopping_channels.findFirstOrThrow({
        where: { code },
      });
    return {
      ...json.transform(record),
      categories: await ShoppingChannelCategoryProvider.hierarchical.entire(
        record,
      ),
    };
  };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create = async (
    input: IShoppingChannel.ICreate,
  ): Promise<IShoppingChannel> => {
    const record = await ShoppingGlobal.prisma.shopping_channels.create({
      data: collect(input),
      ...json.select(),
    });
    return json.transform(record);
  };

  export const update =
    (id: string) =>
    async (input: IShoppingChannel.IUpdate): Promise<void> => {
      const record =
        await ShoppingGlobal.prisma.shopping_channels.findFirstOrThrow({
          where: { id },
        });
      await ShoppingGlobal.prisma.shopping_channels.update({
        where: { id: record.id },
        data: {
          name: input.name ?? record.name,
        },
      });
    };

  export const merge = (input: IRecordMerge) =>
    EntityMergeProvider.merge(
      ShoppingGlobal.prisma.shopping_channels.fields.id.modelName,
    )(input);

  const collect = (input: IShoppingChannel.ICreate) =>
    ({
      id: v4(),
      code: input.code,
      name: input.name,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    } satisfies Prisma.shopping_channelsCreateInput);
}
