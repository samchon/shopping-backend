import typia from "typia";

import api from "../../../../../src/api";

export const test_api_shoppings_customers_deposits_charges_erase = async (
  connection: api.IConnection,
) => {
  const output =
    await api.functional.shoppings.customers.deposits.charges.erase(
      connection,
      {
        id: typia.random<string>(),
      },
    );
  typia.assert(output);
};
