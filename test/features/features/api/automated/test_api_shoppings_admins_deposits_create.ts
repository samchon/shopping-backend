import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingDeposit } from "../../../../../src/api/structures/shoppings/deposits/IShoppingDeposit";

export const test_api_shoppings_admins_deposits_create = async (
  connection: api.IConnection,
) => {
  const output: IShoppingDeposit =
    await api.functional.shoppings.admins.deposits.create(connection, {
      body: typia.random<IShoppingDeposit.ICreate>(),
    });
  typia.assert(output);
};
