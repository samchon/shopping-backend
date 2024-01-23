import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IRecordMerge } from "@samchon/shopping-api/lib/structures/common/IRecordMerge";
import { IShoppingSection } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingSection";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { PaginationUtil } from "../../../utils/PaginationUtil";
import { EntityMergeProvider } from "../../common/EntityMergeProvider";

export namespace ShoppingSectionProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_sectionsGetPayload<ReturnType<typeof select>>,
    ): IShoppingSection => ({
      id: input.id,
      code: input.code,
      name: input.name,
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({}) satisfies Prisma.shopping_sectionsFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index = (
    input: IShoppingSection.IRequest,
  ): Promise<IPage<IShoppingSection>> =>
    PaginationUtil.paginate({
      schema: ShoppingGlobal.prisma.shopping_sections,
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
    input: IShoppingSection.IRequest.ISearch | undefined,
  ) =>
    [
      ...(input?.code?.length ? [{ code: { contains: input.code } }] : []),
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
    ] satisfies Prisma.shopping_sectionsWhereInput["AND"];

  export const orderBy = (
    key: IShoppingSection.IRequest.SortableColumns,
    value: "asc" | "desc",
  ) =>
    (key === "section.code"
      ? { code: value }
      : key === "section.name"
        ? { name: value }
        : {
            created_at: value,
          }) satisfies Prisma.shopping_sectionsOrderByWithRelationInput;

  export const at = async (id: string): Promise<IShoppingSection> => {
    const record =
      await ShoppingGlobal.prisma.shopping_sections.findFirstOrThrow({
        where: { id },
      });
    return json.transform(record);
  };

  export const get = async (code: string): Promise<IShoppingSection> => {
    const record =
      await ShoppingGlobal.prisma.shopping_sections.findFirstOrThrow({
        where: { code },
      });
    return json.transform(record);
  };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create = async (
    input: IShoppingSection.ICreate,
  ): Promise<IShoppingSection> => {
    const record = await ShoppingGlobal.prisma.shopping_sections.create({
      data: collect(input),
      ...json.select(),
    });
    return json.transform(record);
  };

  export const update =
    (id: string) => async (input: IShoppingSection.IUpdate) => {
      const record =
        await ShoppingGlobal.prisma.shopping_sections.findFirstOrThrow({
          where: { id },
        });
      await ShoppingGlobal.prisma.shopping_sections.update({
        where: { id: record.id },
        data: {
          name: input.name,
        },
      });
    };

  export const merge = (input: IRecordMerge) =>
    EntityMergeProvider.merge(
      ShoppingGlobal.prisma.shopping_sections.fields.id.modelName,
    )(input);

  const collect = (input: IShoppingSection.ICreate) =>
    ({
      id: v4(),
      code: input.code,
      name: input.name,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }) satisfies Prisma.shopping_sectionsCreateInput;
}
