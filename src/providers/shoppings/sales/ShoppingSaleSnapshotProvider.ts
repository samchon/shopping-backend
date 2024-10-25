import { ArrayUtil } from "@nestia/e2e";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingPrice } from "@samchon/shopping-api/lib/structures/shoppings/base/IShoppingPrice";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleSnapshot } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleSnapshot";
import { IShoppingSaleUnit } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnit";
import { IShoppingChannelCategory } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannelCategory";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { PaginationUtil } from "../../../utils/PaginationUtil";
import { ShoppingSellerProvider } from "../actors/ShoppingSellerProvider";
import { ShoppingChannelCategoryProvider } from "../systematic/ShoppingChannelCategoryProvider";
import { ShoppingSaleProvider } from "./ShoppingSaleProvider";
import { ShoppingSaleSnapshotChannelProvider } from "./ShoppingSaleSnapshotChannelProvider";
import { ShoppingSaleSnapshotContentProvider } from "./ShoppingSaleSnapshotContentProvider";
import { ShoppingSaleSnapshotUnitProvider } from "./ShoppingSaleSnapshotUnitProvider";

export namespace ShoppingSaleSnapshotProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace summary {
    export const transform = async (
      input: Prisma.shopping_sale_snapshotsGetPayload<ReturnType<typeof select>>
    ): Promise<Omit<IShoppingSaleSnapshot.ISummary, "latest">> => {
      if (input.content === null)
        throw ErrorProvider.internal(
          "No shopping_sale_snapshot_contents record exists."
        );
      else if (input.mv_price_range === null)
        throw ErrorProvider.internal(
          "No mv_shopping_sale_snapshot_prices record exists."
        );
      return {
        id: input.shopping_sale_id,
        snapshot_id: input.id,
        channels: await ArrayUtil.asyncMap(
          input.to_channels.sort((a, b) => (a.sequence = b.sequence))
        )(ShoppingSaleSnapshotChannelProvider.json.transform),
        units: input.units
          .sort((a, b) => (a.sequence = b.sequence))
          .map(ShoppingSaleSnapshotUnitProvider.summary.transform),
        content: ShoppingSaleSnapshotContentProvider.summary.transform(
          input.content
        ),
        tags: input.tags
          .sort((a, b) => (a.sequence = b.sequence))
          .map((tag) => tag.value),
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
          units: ShoppingSaleSnapshotUnitProvider.summary.select(),
          content: ShoppingSaleSnapshotContentProvider.summary.select(),
          to_channels: ShoppingSaleSnapshotChannelProvider.json.select(),
          tags: true,
          mv_price_range: true,
        },
      }) satisfies Prisma.shopping_sale_snapshotsFindManyArgs;
  }

  export namespace json {
    export const transform = async (
      input: Prisma.shopping_sale_snapshotsGetPayload<
        ReturnType<typeof ShoppingSaleSnapshotProvider.json.select>
      >
    ): Promise<Omit<IShoppingSaleSnapshot, "latest">> => {
      if (input.content === null)
        throw ErrorProvider.internal(
          "No shopping_sale_snapshot_contents record exists."
        );
      return {
        id: input.shopping_sale_id,
        snapshot_id: input.id,
        channels: await ArrayUtil.asyncMap(
          input.to_channels.sort((a, b) => (a.sequence = b.sequence))
        )(ShoppingSaleSnapshotChannelProvider.json.transform),
        units: input.units
          .sort((a, b) => a.sequence - b.sequence)
          .map(ShoppingSaleSnapshotUnitProvider.json.transform),
        content: ShoppingSaleSnapshotContentProvider.json.transform(
          input.content
        ),
        tags: input.tags
          .sort((a, b) => (a.sequence = b.sequence))
          .map((tag) => tag.value),
      };
    };
    export const select = () =>
      ({
        include: {
          units: ShoppingSaleSnapshotUnitProvider.json.select(),
          content: ShoppingSaleSnapshotContentProvider.json.select(),
          to_channels: ShoppingSaleSnapshotChannelProvider.json.select(),
          tags: true,
        },
      }) satisfies Prisma.shopping_sale_snapshotsFindManyArgs;
  }

  export namespace history {
    export const transform = async (
      input: Prisma.shopping_sale_snapshotsGetPayload<ReturnType<typeof select>>
    ): Promise<IShoppingSale> => ({
      ...(await json.transform(input)),
      ...ShoppingSaleProvider.history.transform(input.sale),
      updated_at: input.created_at.toISOString(),
      latest: input.mv_last !== null,
    });
    export const select = () =>
      ({
        include: {
          sale: ShoppingSaleProvider.history.select(),
          units: ShoppingSaleSnapshotUnitProvider.json.select(),
          content: ShoppingSaleSnapshotContentProvider.json.select(),
          to_channels: ShoppingSaleSnapshotChannelProvider.json.select(),
          tags: true,
          mv_last: true,
        },
      }) satisfies Prisma.shopping_sale_snapshotsFindManyArgs;
  }

  export namespace invert {
    export const transform = async (
      input: Prisma.shopping_sale_snapshotsGetPayload<ReturnType<typeof select>>
    ): Promise<Omit<IShoppingSaleSnapshot.IInvert, "units">> => {
      if (input.content === null)
        throw ErrorProvider.internal(
          "No shopping_sale_snapshot_contents record exists."
        );
      return {
        ...ShoppingSaleProvider.history.transform(input.sale),
        id: input.shopping_sale_id,
        snapshot_id: input.id,
        channels: await ArrayUtil.asyncMap(
          input.to_channels.sort((a, b) => (a.sequence = b.sequence))
        )(ShoppingSaleSnapshotChannelProvider.json.transform),
        content: ShoppingSaleSnapshotContentProvider.summary.transform(
          input.content
        ),
        tags: input.tags
          .sort((a, b) => (a.sequence = b.sequence))
          .map((tag) => tag.value),
        updated_at: input.created_at.toISOString(),
        latest: input.mv_last !== null,
      };
    };
    export const select = () =>
      ({
        include: {
          sale: ShoppingSaleProvider.history.select(),
          content: ShoppingSaleSnapshotContentProvider.summary.select(),
          to_channels: ShoppingSaleSnapshotChannelProvider.json.select(),
          tags: true,
          mv_last: true,
        },
      }) satisfies Prisma.shopping_sale_snapshotsFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index = async (props: {
    actor: IShoppingActorEntity;
    sale: IEntity;
    input: IPage.IRequest;
  }): Promise<IPage<IShoppingSaleSnapshot.ISummary>> => {
    await ownership(props);
    return PaginationUtil.paginate({
      schema: ShoppingGlobal.prisma.shopping_sale_snapshots,
      payload: {
        include: {
          ...summary.select().include,
          mv_last: true,
        },
      } satisfies Prisma.shopping_sale_snapshotsFindManyArgs,
      transform: async (input) => ({
        ...(await summary.transform(input)),
        id: input.shopping_sale_id,
        latest: input.mv_last !== null,
      }),
    })({
      where: {
        shopping_sale_id: props.sale.id,
      },
      orderBy: [{ created_at: "asc" }],
    } satisfies Prisma.shopping_sale_snapshotsFindManyArgs)(props.input);
  };

  export const at = async (props: {
    actor: IShoppingActorEntity;
    sale: IEntity;
    id: string;
  }): Promise<IShoppingSaleSnapshot> => {
    await ownership(props);
    const record =
      await ShoppingGlobal.prisma.shopping_sale_snapshots.findFirstOrThrow({
        where: {
          id: props.id,
          shopping_sale_id: props.sale.id,
        },
        include: {
          ...json.select().include,
          mv_last: true,
        },
      });
    return {
      ...(await json.transform(record)),
      latest: record.mv_last !== null,
    };
  };

  export const flip = async (props: {
    actor: IShoppingActorEntity;
    sale: IEntity;
    id: string;
  }): Promise<IShoppingSale> => {
    await ownership(props);
    const record =
      await ShoppingGlobal.prisma.shopping_sale_snapshots.findFirstOrThrow({
        where: {
          id: props.id,
          shopping_sale_id: props.sale.id,
        },
        ...history.select(),
      });
    return history.transform(record);
  };

  export const searchInvert = async (props: {
    accessor: string;
    input: IShoppingSale.IRequest.ISearch | undefined;
  }) =>
    [
      ...(await search(props)),
      ...(props.input?.seller !== undefined
        ? ShoppingSellerProvider.searchFromCustomer(props.input.seller).map(
            (sellerCustomer) => ({ sale: { sellerCustomer } })
          )
        : []),
      ...(props.input?.section_codes?.length
        ? [
            {
              sale: {
                section: { code: { in: props.input.section_codes } },
              },
            },
          ]
        : []),
    ] satisfies Prisma.shopping_sale_snapshotsWhereInput["AND"];

  export const search = async (props: {
    accessor: string;
    input: IShoppingSale.IRequest.ISearch | undefined;
  }) =>
    [
      // PRICE
      ...(props.input?.price?.minimum !== undefined
        ? [
            {
              mv_price_range: {
                real_lowest: {
                  gte: props.input.price.minimum,
                },
              },
            },
          ]
        : []),
      ...(props.input?.price?.maximum !== undefined
        ? [
            {
              mv_price_range: {
                real_highest: {
                  lte: props.input.price.maximum,
                },
              },
            },
          ]
        : []),
      // CONTENT
      ...(props.input?.title?.length
        ? [
            {
              content: {
                title: {
                  contains: props.input.title,
                  mode: "insensitive" as const,
                },
              },
            },
          ]
        : []),
      ...(props.input?.content?.length
        ? [
            {
              content: {
                body: {
                  contains: props.input.content,
                  mode: "insensitive" as const,
                },
              },
            },
          ]
        : []),
      ...(props.input?.title_or_content?.length
        ? [
            {
              OR: [
                {
                  content: {
                    title: {
                      contains: props.input.title_or_content,
                      mode: "insensitive" as const,
                    },
                  },
                },
                {
                  content: {
                    body: {
                      contains: props.input.title_or_content,
                      mode: "insensitive" as const,
                    },
                  },
                },
              ],
            },
          ]
        : []),
      ...(props.input?.tags?.length
        ? [
            {
              tags: {
                some: {
                  value: {
                    in: props.input.tags,
                  },
                },
              },
            },
          ]
        : []),
      // CHANNEL
      ...(props.input?.channel_codes?.length
        ? [
            {
              to_channels: {
                some: {
                  channel: { code: { in: props.input.channel_codes } },
                },
              },
            },
          ]
        : []),
      ...(props.input?.channel_category_ids?.length
        ? [
            {
              to_channels: {
                some: {
                  to_categories: {
                    some: {
                      shopping_channel_category_id: {
                        in: await searchCategories({
                          accessor: props.accessor,
                          ids: props.input.channel_category_ids,
                        }),
                      },
                    },
                  },
                },
              },
            },
          ]
        : []),
      // @todo - AGGREGATE NOT YET
    ] satisfies Prisma.shopping_sale_snapshotsWhereInput["AND"];

  export const orderBy = (
    key: IShoppingSale.IRequest.SortableColumns,
    value: "asc" | "desc"
  ) =>
    (key === "sale.created_at"
      ? { sale: { created_at: value } }
      : key === "sale.updated_at"
        ? { created_at: value }
        : key === "sale.opened_at"
          ? { sale: { opened_at: value } }
          : key === "sale.closed_at"
            ? { sale: { closed_at: value } }
            : key === "sale.price_range.lowest.real"
              ? {
                  mv_price_range: {
                    real_lowest: value,
                  },
                }
              : key === "sale.price_range.highest.real"
                ? {
                    mv_price_range: {
                      real_highest: value,
                    },
                  }
                : key === "sale.content.title"
                  ? { content: { title: value } }
                  : key === "goods.payments.real" ||
                      key === "goods.publish_count" ||
                      key === "reviews.average" ||
                      key === "reviews.count"
                    ? { created_at: value } // @todo
                    : {
                        sale: {
                          sellerCustomer: {
                            member: {
                              of_seller: ShoppingSellerProvider.orderBy(
                                key,
                                value
                              ),
                            },
                          },
                        },
                      }) satisfies Prisma.shopping_sale_snapshotsOrderByWithRelationInput;

  const searchCategories = async (props: {
    accessor: string;
    ids: string[];
  }): Promise<string[]> => {
    const records =
      await ShoppingGlobal.prisma.shopping_channel_categories.findMany({
        where: {
          id: {
            in: props.ids,
          },
        },
      });
    if (records.length !== props.ids.length)
      throw ErrorProvider.notFound({
        accessor: `${props.accessor}.channel_ids`,
        message: "Unable to find some categories with matched id.",
      });

    const categories: IShoppingChannelCategory.IHierarchical[] =
      await ArrayUtil.asyncMap(records)((rec) =>
        ShoppingChannelCategoryProvider.hierarchical.at({
          channel: {
            id: rec.shopping_channel_id,
          },
          id: rec.id,
        })
      );
    const output: Set<string> = new Set();
    const gather = (category: IShoppingChannelCategory.IHierarchical) => {
      output.add(category.id);
      category.children.forEach(gather);
    };
    categories.forEach(gather);
    return [...output];
  };

  const ownership = async (props: {
    actor: IShoppingActorEntity;
    sale: IEntity;
  }): Promise<void> => {
    if (props.actor.type !== "seller") return;
    await ShoppingGlobal.prisma.shopping_sale_snapshots.findFirstOrThrow({
      where: {
        sale: {
          id: props.sale.id,
          sellerCustomer: {
            member: {
              of_seller: {
                id: props.actor.id,
              },
            },
          },
        },
      },
    });
  };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const collect = async (input: IShoppingSaleSnapshot.ICreate) => {
    // VALIDATE CHANNELS
    const channels = await ShoppingGlobal.prisma.shopping_channels.findMany({
      where: {
        code: {
          in: input.channels.map((c) => c.code),
        },
      },
    });
    if (channels.length !== input.channels.length)
      throw ErrorProvider.notFound({
        accessor: "input.channels",
        message: "Unable to find some channels with matched code.",
      });

    // VALIDATE CATEGORIES
    const dictionary: Map<string, IEntity> = new Map(
      channels.map((c) => [c.code, c])
    );
    const categoryInputs = input.channels
      .map((c) => c.category_ids.map((id) => [c.code, id] as const))
      .flat();
    if (categoryInputs.length) {
      const categories =
        await ShoppingGlobal.prisma.shopping_channel_categories.findMany({
          where: {
            id: {
              in: categoryInputs.map(([, id]) => id),
            },
          },
        });
      if (categories.length !== categoryInputs.length)
        throw ErrorProvider.notFound({
          accessor: "input.channels[].category_ids",
          message: "Unable to find some categories with matched id.",
        });
      for (const [code, id] of categoryInputs)
        if (
          categories.find((c) => c.id === id)!.shopping_channel_id !==
          dictionary.get(code)!.id
        )
          throw ErrorProvider.conflict({
            accessor: "input.channels[].category_ids",
            message:
              "Some categories are belonged to diffrent channels than expected.",
          });
    }

    return {
      id: v4(),
      to_channels: {
        create: input.channels.map((v, i) =>
          ShoppingSaleSnapshotChannelProvider.collect({
            dictionary,
            input: v,
            sequence: i,
          })
        ),
      },
      content: {
        create: ShoppingSaleSnapshotContentProvider.collect(input.content),
      },
      tags: {
        create: input.tags.map((value, sequence) => ({
          id: v4(),
          value,
          sequence,
        })),
      },
      units: {
        create: input.units.map(ShoppingSaleSnapshotUnitProvider.collect),
      },
      mv_price_range: {
        create: collectPriceRange(input),
      },
      created_at: new Date(),
    } satisfies Prisma.shopping_sale_snapshotsCreateWithoutSaleInput;
  };

  const collectPriceRange = (input: IShoppingSaleSnapshot.ICreate) => {
    const computer =
      (filter: (unit: IShoppingSaleUnit.ICreate) => boolean) =>
      (picker: (p: IShoppingPrice) => number) =>
      (best: (...args: number[]) => number) =>
        input.units
          .filter(filter)
          .map((u) => best(...u.stocks.map((s) => picker(s.price))))
          .reduce((a, b) => a + b);
    return {
      nominal_lowest: computer((u) => u.required)((p) => p.nominal)(Math.min),
      real_lowest: computer((u) => u.required)((p) => p.real)(Math.min),
      real_highest: computer(() => true)((p) => p.real)(Math.max),
      nominal_highest: computer(() => true)((p) => p.nominal)(Math.max),
    } satisfies Prisma.mv_shopping_sale_snapshot_pricesCreateWithoutSnapshotInput;
  };
}
