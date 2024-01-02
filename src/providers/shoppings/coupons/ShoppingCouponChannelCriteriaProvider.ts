import { ArrayUtil } from "@nestia/e2e";
import { Prisma } from "@prisma/client";
import { IPointer } from "tstl";

import { IShoppingCouponChannelCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponChannelCriteria";
import { IShoppingCouponCriteria } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponCriteria";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";

import { MapUtil } from "../../../utils/MapUtil";
import { ShoppingChannelCategoryProvider } from "../systematic/ShoppingChannelCategoryProvider";
import { ShoppingChannelProvider } from "../systematic/ShoppingChannelProvider";

export namespace ShoppingCouponChannelCriterialProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = async (
      inputList: Prisma.shopping_coupon_channel_criteriasGetPayload<
        ReturnType<typeof select>
      >[],
    ): Promise<IShoppingCouponChannelCriteria.IChannelTo[]> => {
      interface ITuple {
        channel: IShoppingChannel;
        category_ids: string[];
      }
      const tupleMap: Map<string, ITuple> = new Map();
      for (const input of inputList) {
        const row = MapUtil.take(tupleMap)(input.shopping_channel_id)(() => ({
          channel: ShoppingChannelProvider.json.transform(input.channel),
          category_ids: [],
        }));
        if (null !== input.shopping_channel_category_id)
          row.category_ids.push(input.shopping_channel_category_id);
      }
      return ArrayUtil.asyncMap([...tupleMap.values()])(async (tuple) => ({
        channel: tuple.channel,
        categories:
          tuple.category_ids.length === 0
            ? null
            : await ArrayUtil.asyncMap(tuple.category_ids)((id) =>
                ShoppingChannelCategoryProvider.invert(tuple.channel)(id),
              ),
      }));
    };
    export const select = () =>
      ({
        include: {
          channel: ShoppingChannelProvider.json.select(),
        },
      } satisfies Prisma.shopping_coupon_channel_criteriasFindManyArgs);
  }

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const collect =
    (counter: IPointer<number>) =>
    (base: () => IShoppingCouponCriteria.ICollectBase) =>
    async (input: IShoppingCouponChannelCriteria.ICreate) =>
      (
        (await ArrayUtil.asyncMap(input.channels)(async (raw) => {
          const channel = await ShoppingChannelProvider.get(raw.channel_code);
          if (raw.category_ids === null)
            return [
              {
                ...base(),
                sequence: counter.value++,
                of_channel: {
                  create: {
                    shopping_channel_id: channel.id,
                    shopping_channel_category_id: null,
                  },
                },
              },
            ];
          await ArrayUtil.asyncMap(raw.category_ids)(
            ShoppingChannelCategoryProvider.at(channel),
          );
          return raw.category_ids.map((cid) => ({
            ...base(),
            sequence: counter.value++,
            of_channel: {
              create: {
                shopping_channel_id: channel.id,
                shopping_channel_category_id: cid,
              },
            },
          }));
        })) satisfies Prisma.shopping_coupon_criteriasCreateWithoutCouponInput[][]
      ).flat();
}
