import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingDeposit } from "../../../../../src/api/structures/shoppings/deposits/IShoppingDeposit";

export const test_api_shoppings_admins_deposits_at = async (
  connection: api.IConnection,
) => {
  const output: IShoppingDeposit =
    await api.functional.shoppings.admins.deposits.at(connection, {
      id: typia.random<string & Format<"uuid">>(),
    });
  typia.assert(output);
};
