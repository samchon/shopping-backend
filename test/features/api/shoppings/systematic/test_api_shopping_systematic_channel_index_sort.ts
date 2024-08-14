import {
  ArrayUtil,
  GaffComparator,
  RandomGenerator,
  TestValidator,
} from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";

export const test_api_shopping_systematic_channel_index_sort = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);
  await ArrayUtil.asyncRepeat(REPEAT)(async () => {
    const channel: IShoppingChannel =
      await ShoppingApi.functional.shoppings.admins.systematic.channels.create(
        pool.admin,
        {
          code: RandomGenerator.alphabets(8),
          name: RandomGenerator.name(8),
        },
      );
    return channel;
  });

  const validator = TestValidator.sort("channels.index")<
    IShoppingChannel,
    IShoppingChannel.IRequest.SortableColumns,
    IPage.Sort<IShoppingChannel.IRequest.SortableColumns>
  >(async (input: IPage.Sort<IShoppingChannel.IRequest.SortableColumns>) => {
    const page: IPage<IShoppingChannel> =
      await ShoppingApi.functional.shoppings.admins.systematic.channels.index(
        pool.admin,
        {
          limit: REPEAT,
          sort: input,
        },
      );
    return page.data;
  });
  const components = [
    validator("channel.code")(GaffComparator.strings((s) => s.code)),
    validator("channel.name")(GaffComparator.strings((s) => s.name)),
    validator("channel.created_at")(
      GaffComparator.strings((s) => s.created_at),
    ),
  ];
  for (const comp of components) {
    await comp("+");
    await comp("-");
  }
};
const REPEAT = 25;
