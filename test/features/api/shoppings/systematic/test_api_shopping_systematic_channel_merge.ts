import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";
import { IShoppingChannelCategory } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannelCategory";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_channel } from "./internal/generate_random_channel";

export const test_api_shopping_systematic_channel_merge = async (
  pool: ConnectionPool
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_seller_join(pool);

  const prefix: string = RandomGenerator.alphabets(8);
  const categoryInput: IShoppingChannelCategory.ICreate = {
    parent_id: null,
    name: RandomGenerator.name(8),
  };
  const channelList: IShoppingChannel[] = await ArrayUtil.asyncRepeat(REPEAT)(
    async () => {
      const channel: IShoppingChannel = await generate_random_channel(pool, {
        code: `${prefix}_${RandomGenerator.alphabets(8)}`,
      });
      await ShoppingApi.functional.shoppings.admins.systematic.channels.categories.create(
        pool.admin,
        channel.code,
        categoryInput
      );
      return channel;
    }
  );

  const sale: IShoppingSale = await generate_random_sale(pool, {
    channels: channelList.map((channel) => ({
      code: channel.code,
      category_ids: [],
    })),
  });

  await ShoppingApi.functional.shoppings.admins.systematic.channels.merge(
    pool.admin,
    {
      keep: channelList[0].id,
      absorbed: channelList.slice(1).map((c) => c.id),
    }
  );

  const page: IPage<IShoppingChannel> =
    await ShoppingApi.functional.shoppings.sellers.systematic.channels.index(
      pool.seller,
      {
        limit: REPEAT,
        search: {
          code: `${prefix}_`,
        },
      }
    );
  TestValidator.equals("merge")([channelList[0]])(page.data);

  const read: IShoppingSale =
    await ShoppingApi.functional.shoppings.sellers.sales.at(
      pool.seller,
      sale.id
    );
  TestValidator.equals("merged sale")([channelList[0]])(
    read.channels.map((sa) => typia.misc.clone<IShoppingChannel>(sa))
  );
};
const REPEAT = 4;
