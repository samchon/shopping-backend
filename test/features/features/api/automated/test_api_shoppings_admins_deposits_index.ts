import typia from "typia";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingDeposit } from "../../../../../src/api/structures/shoppings/deposits/IShoppingDeposit";

export const test_api_shoppings_admins_deposits_index = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingDeposit> =
    await api.functional.shoppings.admins.deposits.index(connection, {
      body: typia.random<IShoppingDeposit.IRequest>(),
    });
  typia.assert(output);
};
