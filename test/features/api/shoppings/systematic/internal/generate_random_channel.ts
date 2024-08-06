import { RandomGenerator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";

import { ConnectionPool } from "../../../../../ConnectionPool";

export const generate_random_channel = async (
  pool: ConnectionPool,
  input?: Partial<IShoppingChannel.ICreate>
): Promise<IShoppingChannel> => {
  const channel: IShoppingChannel =
    await ShoppingApi.functional.shoppings.admins.systematic.channels.create(
      pool.admin,
      {
        code: RandomGenerator.alphabets(16),
        name: RandomGenerator.name(8),
        ...input,
      }
    );
  return channel;
};
