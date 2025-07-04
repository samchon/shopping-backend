import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingChannelCategory } from "../../../../../src/api/structures/shoppings/systematic/IShoppingChannelCategory";

export const test_api_shoppings_customers_systematic_channels_categories_invert =
  async (connection: api.IConnection) => {
    const output: IShoppingChannelCategory.IInvert =
      await api.functional.shoppings.customers.systematic.channels.categories.invert(
        connection,
        {
          channelCode: typia.random<string>(),
          id: typia.random<string & Format<"uuid">>(),
        },
      );
    typia.assert(output);
  };
