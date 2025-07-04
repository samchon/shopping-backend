import typia from "typia";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingChannel } from "../../../../../src/api/structures/shoppings/systematic/IShoppingChannel";

export const test_api_shoppings_sellers_systematic_channels_hierarchical =
  async (connection: api.IConnection) => {
    const output: IPage<IShoppingChannel.IHierarchical> =
      await api.functional.shoppings.sellers.systematic.channels.hierarchical(
        connection,
        {
          body: typia.random<IShoppingChannel.IRequest>(),
        },
      );
    typia.assert(output);
  };
