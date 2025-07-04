import typia from "typia";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingDepositHistory } from "../../../../../src/api/structures/shoppings/deposits/IShoppingDepositHistory";

export const test_api_shoppings_customers_deposits_histories_index = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingDepositHistory> =
    await api.functional.shoppings.customers.deposits.histories.index(
      connection,
      {
        body: typia.random<IShoppingDepositHistory.IRequest>(),
      },
    );
  typia.assert(output);
};
