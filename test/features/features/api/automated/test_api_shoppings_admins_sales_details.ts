import typia from "typia";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingSale } from "../../../../../src/api/structures/shoppings/sales/IShoppingSale";

export const test_api_shoppings_admins_sales_details = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingSale> =
    await api.functional.shoppings.admins.sales.details(connection, {
      body: typia.random<IShoppingSale.IRequest>(),
    });
  typia.assert(output);
};
