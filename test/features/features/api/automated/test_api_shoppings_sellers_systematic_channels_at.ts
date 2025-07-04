import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingChannel } from "../../../../../src/api/structures/shoppings/systematic/IShoppingChannel";

export const test_api_shoppings_sellers_systematic_channels_at = async (
  connection: api.IConnection,
) => {
  const output: IShoppingChannel.IHierarchical =
    await api.functional.shoppings.sellers.systematic.channels.at(connection, {
      id: typia.random<string & Format<"uuid">>(),
    });
  typia.assert(output);
};
