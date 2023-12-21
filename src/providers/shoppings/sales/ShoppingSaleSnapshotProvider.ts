import { Prisma } from "@prisma/client";
import { ShoppingSaleSnapshotContentProvider } from "./ShoppingSaleSnapshotContentProvider";
import { ShoppingSaleSnapshotChannelProvider } from "./ShoppingSaleSnapshotChannelProvider";
import { ShoppingSaleSnapshotUnitProvider } from "./ShoppingSaleSnapshotUnitProvider";
import { ArrayUtil } from "@nestia/e2e";
import { IShoppingSaleSnapshot } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleSnapshot";
import { Singleton } from "tstl";
import typia from "typia";
import { IShoppingBusinessAggregate } from "@samchon/shopping-api/lib/structures/shoppings/sales/aggregates/IShoppingBusinessAggregate";
import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { v4 } from "uuid";

export namespace ShoppingSaleSnapshotProvider {
  export namespace json {
    export const transform = async (
      input: Prisma.shopping_sale_snapshotsGetPayload<
        ReturnType<typeof ShoppingSaleSnapshotProvider.json.select>
      >
    ): Promise<Omit<IShoppingSaleSnapshot, "latest">> => ({
      id: input.shopping_sale_id,
      snapshot_id: input.id,
      channels: await ArrayUtil.asyncMap(input.to_channels)(
        ShoppingSaleSnapshotChannelProvider.json.transform
      ),
      units: input.units
        .sort((a, b) => a.sequence = b.sequence)
        .map(ShoppingSaleSnapshotUnitProvider.json.transform),
      content: ShoppingSaleSnapshotContentProvider.json.transform(input.content!),
      aggregate: aggregate.get(), // @todo -> must be the real data,
      tags: input.tags.sort((a, b) => a.sequence = b.sequence).map((tag) => tag.value),
    })
    export const select = () => ({
      include: {
        units: ShoppingSaleSnapshotUnitProvider.json.select(),
        content: ShoppingSaleSnapshotContentProvider.json.select(),
        to_channels: ShoppingSaleSnapshotChannelProvider.json.select(),
        tags: true,
      }
    } satisfies Prisma.shopping_sale_snapshotsFindManyArgs);
  }

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
    const dict: Map<string, IEntity> = new Map(
      channels.map((c) => [c.code, c]),
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
          dict.get(code)!.id
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
        create: input.channels.map(
          ShoppingSaleSnapshotChannelProvider.collect(dict)
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
        }))
      },
      units: {
        create: input.units.map(ShoppingSaleSnapshotUnitProvider.collect),
      },
      created_at: new Date(),
    } satisfies Prisma.shopping_sale_snapshotsCreateWithoutSaleInput
  };
}

// @todo -> remove
const aggregate = new Singleton(typia.createRandom<IShoppingBusinessAggregate>());
