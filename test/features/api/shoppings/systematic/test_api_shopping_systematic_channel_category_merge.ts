import { ArrayUtil, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";
import { IShoppingChannelCategory } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannelCategory";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_channel } from "./internal/generate_random_channel";

export const test_api_shopping_systematic_channel_category_merge = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_seller_join(pool);

  const channel: IShoppingChannel = await generate_random_channel(pool);
  const rough: Rough = prepare({ level: 0, index: 0 });
  const top: IShoppingChannelCategory.IHierarchical = await generate(
    pool,
    channel,
    null,
    rough,
  );

  const sale: IShoppingSale = await generate_random_sale(pool, {
    channels: [
      {
        code: channel.code,
        category_ids: top.children.map((c) => c.id),
      },
    ],
  });

  await ShoppingApi.functional.shoppings.admins.systematic.channels.categories.merge(
    pool.admin,
    channel.code,
    {
      keep: top.children[0].id,
      absorbed: top.children.slice(1).map((c) => c.id),
    },
  );

  const expected: Rough = {
    name: "0",
    children: [
      {
        name: "0",
        children: ArrayUtil.repeat(REPEAT)((i) => ({
          name: i.toString(),
          children: [],
        })),
      },
    ],
  };

  const reloaded: IShoppingSale =
    await ShoppingApi.functional.shoppings.admins.sales.at(pool.admin, sale.id);
  TestValidator.equals("sale.channels[].categories")(
    expected.children.map((c) => ({
      name: c.name,
    })),
  )(reloaded.channels[0].categories);

  const entire: IShoppingChannelCategory.IHierarchical[] =
    await ShoppingApi.functional.shoppings.admins.systematic.channels.categories.index(
      pool.admin,
      channel.code,
    );
  TestValidator.equals("categories")([expected])(entire);
};

interface Rough {
  name: string;
  children: Rough[];
}
const prepare = (props: { level: number; index: number }): Rough => ({
  name: props.index.toString(),
  children:
    props.level < 2
      ? ArrayUtil.repeat(REPEAT)((j) =>
          prepare({
            level: props.level + 1,
            index: j,
          }),
        )
      : [],
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
  category.children = await ArrayUtil.asyncMap(input.children)((child) =>
    generate(pool, channel, category.id, child),
  );
  return category;
};
const REPEAT = 4;
