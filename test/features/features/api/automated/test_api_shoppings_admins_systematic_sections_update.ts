import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingSection } from "../../../../../src/api/structures/shoppings/systematic/IShoppingSection";

export const test_api_shoppings_admins_systematic_sections_update = async (
  connection: api.IConnection,
) => {
  const output =
    await api.functional.shoppings.admins.systematic.sections.update(
      connection,
      {
        id: typia.random<string & Format<"uuid">>(),
        body: typia.random<IShoppingSection.IUpdate>(),
      },
    );
  typia.assert(output);
};
