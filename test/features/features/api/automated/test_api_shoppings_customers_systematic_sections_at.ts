import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingSection } from "../../../../../src/api/structures/shoppings/systematic/IShoppingSection";

export const test_api_shoppings_customers_systematic_sections_at = async (
  connection: api.IConnection,
) => {
  const output: IShoppingSection =
    await api.functional.shoppings.customers.systematic.sections.at(
      connection,
      {
        id: typia.random<string & Format<"uuid">>(),
      },
    );
  typia.assert(output);
};
