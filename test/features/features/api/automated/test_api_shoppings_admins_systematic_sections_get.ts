import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingSection } from "../../../../../src/api/structures/shoppings/systematic/IShoppingSection";

export const test_api_shoppings_admins_systematic_sections_get = async (
  connection: api.IConnection,
) => {
  const output: IShoppingSection =
    await api.functional.shoppings.admins.systematic.sections.get(connection, {
      code: typia.random<string>(),
    });
  typia.assert(output);
};
