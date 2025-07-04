import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingCustomer } from "../../../../../src/api/structures/shoppings/actors/IShoppingCustomer";
import type { IShoppingExternalUser } from "../../../../../src/api/structures/shoppings/actors/IShoppingExternalUser";

export const test_api_shoppings_customers_authenticate_external = async (
  connection: api.IConnection,
) => {
  const output: IShoppingCustomer =
    await api.functional.shoppings.customers.authenticate.external(connection, {
      body: typia.random<IShoppingExternalUser.ICreate>(),
    });
  typia.assert(output);
};
