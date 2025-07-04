import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingDepositCharge } from "../../../../../src/api/structures/shoppings/deposits/IShoppingDepositCharge";

export const test_api_shoppings_customers_deposits_charges_update = async (
  connection: api.IConnection,
) => {
  const output =
    await api.functional.shoppings.customers.deposits.charges.update(
      connection,
      {
        id: typia.random<string>(),
        body: typia.random<IShoppingDepositCharge.ICreate>(),
      },
    );
  typia.assert(output);
};
