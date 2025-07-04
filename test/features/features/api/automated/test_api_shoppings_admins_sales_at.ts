import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingSale } from "../../../../../src/api/structures/shoppings/sales/IShoppingSale";

export const test_api_shoppings_admins_sales_at = async (
  connection: api.IConnection,
) => {
  const output: IShoppingSale = await api.functional.shoppings.admins.sales.at(
    connection,
    {
      id: typia.random<string & Format<"uuid">>(),
    },
  );
  typia.assert(output);
};
