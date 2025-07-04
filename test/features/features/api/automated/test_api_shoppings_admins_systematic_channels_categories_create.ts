import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingChannelCategory } from "../../../../../src/api/structures/shoppings/systematic/IShoppingChannelCategory";

export const test_api_shoppings_admins_systematic_channels_categories_create =
  async (connection: api.IConnection) => {
    const output: IShoppingChannelCategory =
      await api.functional.shoppings.admins.systematic.channels.categories.create(
        connection,
        {
          channelCode: typia.random<string>(),
          body: typia.random<IShoppingChannelCategory.ICreate>(),
        },
      );
    typia.assert(output);
  };
