import { TestValidator } from "@nestia/e2e";

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
  const read: IShoppingChannel.IHierarchical =
    await ShoppingApi.functional.shoppings.admins.systematic.channels.at(
      pool.admin,
      channel.id,
    );
  TestValidator.equals("create", channel, read);
};
