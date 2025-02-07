import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { generate_random_channel } from "./internal/generate_random_channel";

export const test_api_shopping_systematic_channel_merge = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);

  const prefix: string = RandomGenerator.alphabets(8);
  const channelList: IShoppingChannel[] = await ArrayUtil.asyncRepeat(REPEAT)(
    () =>
      generate_random_channel(pool, {
        code: `${prefix}_${RandomGenerator.alphabets(8)}`,
      }),
  );

  await ShoppingApi.functional.shoppings.admins.systematic.channels.merge(
    pool.admin,
    {
      keep: channelList[0].id,
      absorbed: channelList.slice(1).map((c) => c.id),
    },
  );

  const page: IPage<IShoppingChannel> =
    await ShoppingApi.functional.shoppings.admins.systematic.channels.index(
      pool.admin,
      {
        limit: REPEAT,
        search: {
          code: `${prefix}_`,
        },
      },
    );
  TestValidator.equals("merge")([channelList[0]])(page.data);
};

const REPEAT = 4;
