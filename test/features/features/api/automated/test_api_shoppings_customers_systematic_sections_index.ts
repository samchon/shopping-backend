import typia from "typia";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingSection } from "../../../../../src/api/structures/shoppings/systematic/IShoppingSection";

export const test_api_shoppings_customers_systematic_sections_index = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingSection> =
    await api.functional.shoppings.customers.systematic.sections.index(
      connection,
      {
        body: typia.random<IShoppingSection.IRequest>(),
      },
    );
  typia.assert(output);
};
