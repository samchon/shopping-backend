import typia from "typia";

import api from "../../../../../src/api";
import type { IRecordMerge } from "../../../../../src/api/structures/common/IRecordMerge";

export const test_api_shoppings_admins_systematic_sections_merge = async (
  connection: api.IConnection,
) => {
  const output =
    await api.functional.shoppings.admins.systematic.sections.merge(
      connection,
      {
        body: typia.random<IRecordMerge>(),
      },
    );
  typia.assert(output);
};
