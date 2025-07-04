import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingCustomer } from "../../../../../src/api/structures/shoppings/actors/IShoppingCustomer";

export const test_api_shoppings_customers_authenticate_get = async (
  connection: api.IConnection,
) => {
  const output: IShoppingCustomer =
    await api.functional.shoppings.customers.authenticate.get(connection);
  typia.assert(output);
};
