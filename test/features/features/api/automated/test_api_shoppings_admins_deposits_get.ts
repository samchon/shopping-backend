import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingDeposit } from "../../../../../src/api/structures/shoppings/deposits/IShoppingDeposit";

export const test_api_shoppings_admins_deposits_get = async (
  connection: api.IConnection,
) => {
  const output: IShoppingDeposit =
    await api.functional.shoppings.admins.deposits.get(connection, {
      code: typia.random<string>(),
    });
  typia.assert(output);
};
