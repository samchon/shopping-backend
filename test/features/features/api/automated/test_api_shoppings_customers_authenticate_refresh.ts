import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingCustomer } from "../../../../../src/api/structures/shoppings/actors/IShoppingCustomer";

export const test_api_shoppings_customers_authenticate_refresh = async (
  connection: api.IConnection,
) => {
  const output: IShoppingCustomer.IAuthorized =
    await api.functional.shoppings.customers.authenticate.refresh(connection, {
      body: typia.random<IShoppingCustomer.IRefresh>(),
    });
  typia.assert(output);
};
