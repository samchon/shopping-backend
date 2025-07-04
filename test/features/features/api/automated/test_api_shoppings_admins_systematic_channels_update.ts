import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingChannel } from "../../../../../src/api/structures/shoppings/systematic/IShoppingChannel";

export const test_api_shoppings_admins_systematic_channels_update = async (
  connection: api.IConnection,
) => {
  const output =
    await api.functional.shoppings.admins.systematic.channels.update(
      connection,
      {
        id: typia.random<string & Format<"uuid">>(),
        body: typia.random<IShoppingChannel.IUpdate>(),
      },
    );
  typia.assert(output);
};
