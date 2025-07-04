import typia from "typia";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingDepositCharge } from "../../../../../src/api/structures/shoppings/deposits/IShoppingDepositCharge";

export const test_api_shoppings_customers_deposits_charges_index = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingDepositCharge> =
    await api.functional.shoppings.customers.deposits.charges.index(
      connection,
      {
        body: typia.random<IShoppingDepositCharge.IRequest>(),
      },
    );
  typia.assert(output);
};
