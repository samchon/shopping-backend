import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";
import { randint } from "tstl";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";
import { IShoppingChannelCategory } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannelCategory";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_admin_login } from "../actors/test_api_hub_admin_login";
import { generate_random_channel } from "./internal/generate_random_channel";

export const test_api_shopping_systematic_channel_category_store = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_admin_login(pool);

  const channel: IShoppingChannel = await generate_random_channel(pool);
  const input: Rough = prepare(0);
  const category: IShoppingChannelCategory = await generate(
    pool,
    channel,
    null,
    input,
  );
  TestValidator.equals("category")(input)(category);
};

interface Rough {
  name: string;
  children: Rough[];
}
const prepare = (level: number): Rough => ({
  name: RandomGenerator.name(8),
  children:
    level < 2 ? ArrayUtil.repeat(randint(0, 3))(() => prepare(level + 1)) : [],
});
const generate = async (
  pool: ConnectionPool,
  channel: IShoppingChannel,
  parent_id: string | null,
  input: Rough,
): Promise<IShoppingChannelCategory> => {
  const category: IShoppingChannelCategory =
    await ShoppingApi.functional.shoppings.admins.systematic.channels.categories.create(
      pool.admin,
      channel.code,
      {
        name: input.name,
        parent_id,
      },
    );
  typia.assertEquals(category);
  category.children = await ArrayUtil.asyncMap(input.children)((child) =>
    generate(pool, channel, category.id, child),
  );
  return category;
};
