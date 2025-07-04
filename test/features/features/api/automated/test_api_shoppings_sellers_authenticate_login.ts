import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingMember } from "../../../../../src/api/structures/shoppings/actors/IShoppingMember";
import type { IShoppingSeller } from "../../../../../src/api/structures/shoppings/actors/IShoppingSeller";

export const test_api_shoppings_sellers_authenticate_login = async (
  connection: api.IConnection,
) => {
  const output: IShoppingSeller.IInvert =
    await api.functional.shoppings.sellers.authenticate.login(connection, {
      body: typia.random<IShoppingMember.ILogin>(),
    });
  typia.assert(output);
};
