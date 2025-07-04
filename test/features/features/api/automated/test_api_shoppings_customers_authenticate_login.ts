import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingCustomer } from "../../../../../src/api/structures/shoppings/actors/IShoppingCustomer";
import type { IShoppingMember } from "../../../../../src/api/structures/shoppings/actors/IShoppingMember";

export const test_api_shoppings_customers_authenticate_login = async (
  connection: api.IConnection,
) => {
  const output: IShoppingCustomer =
    await api.functional.shoppings.customers.authenticate.login(connection, {
      body: typia.random<IShoppingMember.ILogin>(),
    });
  typia.assert(output);
};
