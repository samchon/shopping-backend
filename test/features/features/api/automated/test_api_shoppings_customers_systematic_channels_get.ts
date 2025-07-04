import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingChannel } from "../../../../../src/api/structures/shoppings/systematic/IShoppingChannel";

export const test_api_shoppings_customers_systematic_channels_get = async (
  connection: api.IConnection,
) => {
  const output: IShoppingChannel.IHierarchical =
    await api.functional.shoppings.customers.systematic.channels.get(
      connection,
      {
        code: typia.random<string>(),
      },
    );
  typia.assert(output);
};
