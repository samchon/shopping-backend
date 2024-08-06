import { RandomGenerator, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";
import { IShoppingChannelCategory } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannelCategory";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { generate_random_channel } from "./internal/generate_random_channel";

export const test_api_shopping_systematic_channel_category_update = async (
  pool: ConnectionPool
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);

  const channel: IShoppingChannel = await generate_random_channel(pool);
  const generate = async (
    parent: IShoppingChannelCategory | null
  ): Promise<IShoppingChannelCategory> => {
    const child: IShoppingChannelCategory =
      await ShoppingApi.functional.shoppings.admins.systematic.channels.categories.create(
        pool.admin,
        channel.code,
        {
          parent_id: parent?.id ?? null,
          name: RandomGenerator.name(8),
        }
      );
    return child;
  };
  const left: IShoppingChannelCategory = await generate(null);
  const right: IShoppingChannelCategory = await generate(null);
  const child: IShoppingChannelCategory = await generate(left);

  await ShoppingApi.functional.shoppings.admins.systematic.channels.categories.update(
    pool.admin,
    channel.code,
    child.id,
    {
      parent_id: right.id,
      name: child.name,
    }
  );

  const expected: Rough[] = [
    {
      name: left.name,
      children: [] as Rough[],
    },
    {
      name: right.name,
      children: [
        {
          name: child.name,
          children: [] as Rough[],
        },
      ],
    },
  ];
  const entire: IShoppingChannelCategory.IHierarchical[] =
    await ShoppingApi.functional.shoppings.admins.systematic.channels.categories.index(
      pool.admin,
      channel.code
    );
  TestValidator.equals("update")(expected)(entire);
};

interface Rough {
  name: string;
  children: Rough[];
}
