import { RandomGenerator, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { generate_random_channel } from "./internal/generate_random_channel";

export const test_api_shopping_systematic_channel_create = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);

  const channel: IShoppingChannel = await generate_random_channel(pool);
  const name: string = RandomGenerator.name(8);
  await ShoppingApi.functional.shoppings.admins.systematic.channels.update(
    pool.admin,
    channel.id,
    {
      name,
    },
  );

  const read: IShoppingChannel =
    await ShoppingApi.functional.shoppings.admins.systematic.channels.at(
      pool.admin,
      channel.id,
    );
  typia.assertEquals(read);
  TestValidator.equals("update")(name)(read.name);
};
