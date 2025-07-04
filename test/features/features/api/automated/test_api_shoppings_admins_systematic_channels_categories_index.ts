import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingChannelCategory } from "../../../../../src/api/structures/shoppings/systematic/IShoppingChannelCategory";

export const test_api_shoppings_admins_systematic_channels_categories_index =
  async (connection: api.IConnection) => {
    const output: Array<IShoppingChannelCategory.IHierarchical> =
      await api.functional.shoppings.admins.systematic.channels.categories.index(
        connection,
        {
          channelCode: typia.random<string>(),
        },
      );
    typia.assert(output);
  };
