import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingCitizen } from "../../../../../src/api/structures/shoppings/actors/IShoppingCitizen";
import type { IShoppingCustomer } from "../../../../../src/api/structures/shoppings/actors/IShoppingCustomer";

export const test_api_shoppings_customers_authenticate_activate = async (
  connection: api.IConnection,
) => {
  const output: IShoppingCustomer =
    await api.functional.shoppings.customers.authenticate.activate(connection, {
      body: typia.random<IShoppingCitizen.ICreate>(),
    });
  typia.assert(output);
};
