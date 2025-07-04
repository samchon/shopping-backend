import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingDepositHistory } from "../../../../../src/api/structures/shoppings/deposits/IShoppingDepositHistory";

export const test_api_shoppings_customers_deposits_histories_at = async (
  connection: api.IConnection,
) => {
  const output: IShoppingDepositHistory =
    await api.functional.shoppings.customers.deposits.histories.at(connection, {
      id: typia.random<string & Format<"uuid">>(),
    });
  typia.assert(output);
};
