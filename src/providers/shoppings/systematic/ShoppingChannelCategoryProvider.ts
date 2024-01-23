import { Prisma, shopping_channel_categories } from "@prisma/client";
import {
  IPointer,
  MutableSingleton,
  VariadicMutableSingleton,
  VariadicSingleton,
} from "tstl";
import { v4 } from "uuid";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IRecordMerge } from "@samchon/shopping-api/lib/structures/common/IRecordMerge";
import { IShoppingChannelCategory } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannelCategory";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { CacheProvider } from "../../common/CacheProvider";
import { EntityMergeProvider } from "../../common/EntityMergeProvider";

export namespace ShoppingChannelCategoryProvider {
  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export namespace hierarchical {
    export const entire = async (channel: IEntity) =>
      (await (await cache.get(channel.id)).hierarchical())[0];

    export const at =
      (channel: IEntity) =>
      async (id: string): Promise<IShoppingChannelCategory.IHierarchical> => {
        const record =
          (await (await cache.get(channel.id)).hierarchical())[1].get(id) ??
          null;
        if (record === null)
          throw ErrorProvider.notFound("Unable to find the matched category.");
        return record;
      };
  }

  export const at =
    (channel: IEntity) =>
    async (id: string): Promise<IShoppingChannelCategory> => {
      const record = await (await cache.get(channel.id)).at(id);
      if (record === null)
        throw ErrorProvider.notFound("Unable to find the matched category.");
      return record;
    };

  export const invert =
    (channel: IEntity) =>
    async (id: string): Promise<IShoppingChannelCategory.IInvert> => {
      const record =
        (await (await cache.get(channel.id)).invert()).get(id) ?? null;
      if (record === null)
        throw ErrorProvider.notFound("Unable to find the matched category.");
      return record;
    };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create =
    (channel: IEntity) =>
    async (
      input: IShoppingChannelCategory.ICreate,
    ): Promise<IShoppingChannelCategory> => {
      if (input.parent_id !== null)
        await ShoppingGlobal.prisma.shopping_channel_categories.findFirstOrThrow(
          {
            where: {
              id: input.parent_id,
              shopping_channel_id: channel.id,
            },
          },
        );
      const record =
        await ShoppingGlobal.prisma.shopping_channel_categories.create({
          data: collect(channel)(input),
        });
      await CacheProvider.emplace({
        schema: "shoppings",
        table: "shopping_channel_categories",
        key: channel.id,
      });
      return await at(channel)(record.id);
    };

  export const update =
    (channel: IEntity) =>
    (id: string) =>
    async (input: IShoppingChannelCategory.IUpdate): Promise<void> => {
      const record =
        await ShoppingGlobal.prisma.shopping_channel_categories.findFirstOrThrow(
          {
            where: {
              shopping_channel_id: channel.id,
              id,
            },
          },
        );
      if (input.parent_id?.length)
        await ShoppingGlobal.prisma.shopping_channel_categories.findFirstOrThrow(
          {
            where: {
              id: input.parent_id,
              shopping_channel_id: channel.id,
            },
          },
        );
      await ShoppingGlobal.prisma.shopping_channel_categories.update({
        where: { id: record.id },
        data: {
          name: input.name ?? record.name,
          parent_id:
            input.parent_id !== undefined ? input.parent_id : record.parent_id,
        },
      });
    };

  export const merge = (channel: IEntity) => async (input: IRecordMerge) => {
    const categories =
      await ShoppingGlobal.prisma.shopping_channel_categories.findMany({
        where: {
          shopping_channel_id: channel.id,
          id: {
            in: [input.keep, ...input.absorbed],
          },
        },
      });
    if (categories.length !== input.absorbed.length + 1)
      throw ErrorProvider.notFound({
        accessor: "input.keep | input.absorbed",
        message: "Failed to find some categories.",
      });
    await EntityMergeProvider.merge(
      ShoppingGlobal.prisma.shopping_channel_categories.fields.id.modelName,
    )(input);
  };

  const collect =
    (channel: IEntity) => (input: IShoppingChannelCategory.ICreate) =>
      ({
        id: v4(),
        channel: { connect: { id: channel.id } },
        parent:
          input.parent_id !== null
            ? { connect: { id: input.parent_id } }
            : undefined,
        name: input.name,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      }) satisfies Prisma.shopping_channel_categoriesCreateInput;
}

const cache = new VariadicSingleton((channel_id: string) => {
  const raw = new MutableSingleton(() =>
    ShoppingGlobal.prisma.shopping_channel_categories.findMany({
      where: {
        shopping_channel_id: channel_id,
      },
    }),
  );
  const invert = new MutableSingleton(async () => {
    // TRANSFORMATION
    const primitive: shopping_channel_categories[] = await raw.get();
    const elements: IShoppingChannelCategory.IInvert[] = primitive.map((p) => ({
      ...p,
      parent: null,
      created_at: p.created_at.toISOString(),
    }));

    // JOINING
    const dict: Map<string, IShoppingChannelCategory.IInvert> = new Map();
    for (const elem of elements) dict.set(elem.id, elem);
    for (const elem of elements) {
      if (elem.parent_id === null) continue;
      const parent = dict.get(elem.parent_id)!;
      elem.parent = parent;
    }
    return dict;
  });
  const hierarchical = new MutableSingleton(async () => {
    // TRANSFORMATION
    const primitive: shopping_channel_categories[] = await raw.get();
    const elements: IShoppingChannelCategory.IHierarchical[] = primitive.map(
      (p) => ({
        id: p.id,
        name: p.name,
        parent_id: p.parent_id,
        created_at: p.created_at.toISOString(),
        children: [],
      }),
    );

    // JOINING
    const dict: Map<string, IShoppingChannelCategory.IHierarchical> = new Map();
    const top: IShoppingChannelCategory.IHierarchical[] = [];

    for (const elem of elements) dict.set(elem.id, elem);
    for (const elem of elements)
      if (elem.parent_id === null) top.push(elem);
      else {
        const parent = dict.get(elem.parent_id)!;
        parent.children.push(elem);
      }
    return [top, dict] as const;
  });
  const detail = new VariadicMutableSingleton(
    async (id: string): Promise<IShoppingChannelCategory | null> => {
      const up = (await invert.get()).get(id);
      const down = (await hierarchical.get())[1].get(id);
      if (!up || !down) return null;
      return {
        ...down,
        parent: up.parent,
      };
    },
  );

  const time: IPointer<Date> = { value: new Date(0) };
  const checker = async () => {
    const history = await CacheProvider.get({
      schema: "shoppings",
      table: "shopping_channel_categories",
      key: channel_id,
    });
    if (history.getTime() !== time.value.getTime()) {
      time.value = history;
      await raw.clear();
      await invert.clear();
      await hierarchical.clear();
      await detail.clear();
    }
  };
  return {
    hierarchical: async () => {
      await checker();
      return hierarchical.get();
    },
    invert: async () => {
      await checker();
      return invert.get();
    },
    at: async (id: string) => {
      await checker();
      return detail.get(id);
    },
  };
});
