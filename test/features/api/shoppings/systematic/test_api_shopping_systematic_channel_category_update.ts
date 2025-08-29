import { RandomGenerator, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";
import { IShoppingChannelCategory } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannelCategory";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";

export const test_api_shopping_systematic_channel_category_update = async (
  pool: ConnectionPool,
): Promise<void> => {
  const admin: IShoppingAdministrator.IInvert =
    await test_api_shopping_actor_admin_login(pool);
  const channel: IShoppingChannel = admin.customer.channel;

  const generate = async (
    parent: IShoppingChannelCategory | null,
  ): Promise<IShoppingChannelCategory> => {
    const child: IShoppingChannelCategory =
      await ShoppingApi.functional.shoppings.admins.systematic.channels.categories.create(
        pool.admin,
        channel.code,
        {
          parent_id: parent?.id ?? null,
          name: RandomGenerator.name(8),
          code: RandomGenerator.alphabets(8),
        },
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
      code: child.code,
    },
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
      channel.code,
    );
  TestValidator.equals("update", expected, entire);
};

interface Rough {
  name: string;
  children: Rough[];
}
