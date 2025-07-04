import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingAdministrator } from "../../../../../src/api/structures/shoppings/actors/IShoppingAdministrator";
import type { IShoppingMember } from "../../../../../src/api/structures/shoppings/actors/IShoppingMember";

export const test_api_shoppings_admins_authenticate_login = async (
  connection: api.IConnection,
) => {
  const output: IShoppingAdministrator.IInvert =
    await api.functional.shoppings.admins.authenticate.login(connection, {
      body: typia.random<IShoppingMember.ILogin>(),
    });
  typia.assert(output);
};
