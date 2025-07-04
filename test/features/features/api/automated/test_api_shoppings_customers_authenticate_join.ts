import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingCustomer } from "../../../../../src/api/structures/shoppings/actors/IShoppingCustomer";
import type { IShoppingMember } from "../../../../../src/api/structures/shoppings/actors/IShoppingMember";

export const test_api_shoppings_customers_authenticate_join = async (
  connection: api.IConnection,
) => {
  const output: IShoppingCustomer =
    await api.functional.shoppings.customers.authenticate.join(connection, {
      body: typia.random<IShoppingMember.IJoin>(),
    });
  typia.assert(output);
};
