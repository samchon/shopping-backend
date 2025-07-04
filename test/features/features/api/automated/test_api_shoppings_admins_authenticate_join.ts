import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingAdministrator } from "../../../../../src/api/structures/shoppings/actors/IShoppingAdministrator";

export const test_api_shoppings_admins_authenticate_join = async (
  connection: api.IConnection,
) => {
  const output: IShoppingAdministrator.IInvert =
    await api.functional.shoppings.admins.authenticate.join(connection, {
      body: typia.random<IShoppingAdministrator.IJoin>(),
    });
  typia.assert(output);
};
