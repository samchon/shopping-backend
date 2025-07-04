import typia from "typia";

import api from "../../../../../src/api";
import type { IRecordMerge } from "../../../../../src/api/structures/common/IRecordMerge";

export const test_api_shoppings_admins_systematic_channels_categories_merge =
  async (connection: api.IConnection) => {
    const output =
      await api.functional.shoppings.admins.systematic.channels.categories.merge(
        connection,
        {
          channelCode: typia.random<string>(),
          body: typia.random<IRecordMerge>(),
        },
      );
    typia.assert(output);
  };
