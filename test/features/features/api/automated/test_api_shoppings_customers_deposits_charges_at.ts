import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingDepositCharge } from "../../../../../src/api/structures/shoppings/deposits/IShoppingDepositCharge";

export const test_api_shoppings_customers_deposits_charges_at = async (
  connection: api.IConnection,
) => {
  const output: IShoppingDepositCharge =
    await api.functional.shoppings.customers.deposits.charges.at(connection, {
      id: typia.random<string>(),
    });
  typia.assert(output);
};
