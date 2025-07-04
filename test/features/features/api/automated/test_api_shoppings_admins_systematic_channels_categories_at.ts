import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingChannelCategory } from "../../../../../src/api/structures/shoppings/systematic/IShoppingChannelCategory";

export const test_api_shoppings_admins_systematic_channels_categories_at =
  async (connection: api.IConnection) => {
    const output: IShoppingChannelCategory =
      await api.functional.shoppings.admins.systematic.channels.categories.at(
        connection,
        {
          channelCode: typia.random<string>(),
          id: typia.random<string & Format<"uuid">>(),
        },
      );
    typia.assert(output);
  };
