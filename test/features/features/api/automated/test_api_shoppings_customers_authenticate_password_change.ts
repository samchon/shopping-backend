import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingMember } from "../../../../../src/api/structures/shoppings/actors/IShoppingMember";

export const test_api_shoppings_customers_authenticate_password_change = async (
  connection: api.IConnection,
) => {
  const output =
    await api.functional.shoppings.customers.authenticate.password.change(
      connection,
      {
        body: typia.random<IShoppingMember.IPasswordChange>(),
      },
    );
  typia.assert(output);
};
