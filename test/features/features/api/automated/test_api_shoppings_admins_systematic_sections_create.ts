import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingSection } from "../../../../../src/api/structures/shoppings/systematic/IShoppingSection";

export const test_api_shoppings_admins_systematic_sections_create = async (
  connection: api.IConnection,
) => {
  const output: IShoppingSection =
    await api.functional.shoppings.admins.systematic.sections.create(
      connection,
      {
        body: typia.random<IShoppingSection.ICreate>(),
      },
    );
  typia.assert(output);
};
