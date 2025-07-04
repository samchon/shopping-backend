import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingChannel } from "../../../../../src/api/structures/shoppings/systematic/IShoppingChannel";

export const test_api_shoppings_admins_systematic_channels_create = async (
  connection: api.IConnection,
) => {
  const output: IShoppingChannel =
    await api.functional.shoppings.admins.systematic.channels.create(
      connection,
      {
        body: typia.random<IShoppingChannel.ICreate>(),
      },
    );
  typia.assert(output);
};
