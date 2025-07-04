import typia from "typia";

import api from "../../../../../src/api";

export const test_api_shoppings_customers_deposits_histories_balance = async (
  connection: api.IConnection,
) => {
  const output: number =
    await api.functional.shoppings.customers.deposits.histories.balance(
      connection,
    );
  typia.assert(output);
};
