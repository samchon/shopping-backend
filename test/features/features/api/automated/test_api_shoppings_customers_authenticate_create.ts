import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingCustomer } from "../../../../../src/api/structures/shoppings/actors/IShoppingCustomer";

export const test_api_shoppings_customers_authenticate_create = async (
  connection: api.IConnection,
) => {
  const output: IShoppingCustomer.IAuthorized =
    await api.functional.shoppings.customers.authenticate.create(connection, {
      body: typia.random<IShoppingCustomer.ICreate>(),
    });
  typia.assert(output);
};
