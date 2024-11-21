import { ArrayUtil } from "@nestia/e2e";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IShoppingSaleChannel } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleChannel";
import { IShoppingChannelCategory } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannelCategory";

import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingChannelCategoryProvider } from "../systematic/ShoppingChannelCategoryProvider";
import { ShoppingChannelProvider } from "../systematic/ShoppingChannelProvider";

export namespace ShoppingSaleSnapshotChannelProvider {
  export namespace json {
    export const transform = async (
      input: Prisma.shopping_sale_snapshot_channelsGetPayload<
        ReturnType<typeof select>
      >
    ): Promise<IShoppingSaleChannel> => ({
      ...ShoppingChannelProvider.json.transform(input.channel),
      categories: await ArrayUtil.asyncMap(input.to_categories)(async (r) => {
        const category: IShoppingChannelCategory | null =
          await ShoppingChannelCategoryProvider.at({
            channel: input.channel,
            id: r.shopping_channel_category_id,
          });
        if (category === null)
          throw ErrorProvider.internal("Unable to find the matched category.");
        return category;
      }),
    });
    export const select = () =>
      ({
        include: {
          channel: ShoppingChannelProvider.json.select(),
          to_categories: true,
        },
      }) satisfies Prisma.shopping_sale_snapshot_channelsFindManyArgs;
  }

  export const collect = (props: {
    channel: IEntity;
    input: IShoppingSaleChannel.ICreate;
    dict: Map<string, IEntity>;
    sequence: number;
  }) => {
    return {
      id: v4(),
      channel: { connect: { id: props.channel.id } },
      to_categories: {
        create: props.input.category_codes.map((code, i) => ({
          id: v4(),
          shopping_channel_category_id: props.dict.get(code)!.id,
          sequence: i,
        })),
      },
      sequence: props.sequence,
    } satisfies Prisma.shopping_sale_snapshot_channelsCreateWithoutSnapshotInput;
  };
}
