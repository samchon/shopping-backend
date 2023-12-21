import { ArrayUtil, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { generate_random_channel } from "./internal/generate_random_channel";

export const test_api_shopping_systematic_channel_index_search = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);

  const channelList: IShoppingChannel[] = await ArrayUtil.asyncRepeat(REPEAT)(
    () => generate_random_channel(pool),
  );
  const search = TestValidator.search("sales.index")(
    async (input: IShoppingChannel.IRequest.ISearch) => {
      const page: IPage<IShoppingChannel> =
        await ShoppingApi.functional.shoppings.admins.systematic.channels.index(
          pool.customer,
          {
            limit: channelList.length,
            search: input,
            sort: ["-channel.created_at"],
          },
        );
      return typia.assertEquals(page).data;
    },
  )(channelList, 4);

  await search({
    fields: ["sectiob.name"],
    values: (channel) => [channel.name],
    request: ([name]) => ({ name }),
    filter: (channel, [name]) => channel.name.includes(name),
  });
};

const REPEAT = 25;
