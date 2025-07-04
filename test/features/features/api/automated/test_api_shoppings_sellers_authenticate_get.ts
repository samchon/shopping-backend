import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingSeller } from "../../../../../src/api/structures/shoppings/actors/IShoppingSeller";

export const test_api_shoppings_sellers_authenticate_get = async (
  connection: api.IConnection,
) => {
  const output: IShoppingSeller.IInvert =
    await api.functional.shoppings.sellers.authenticate.get(connection);
  typia.assert(output);
};
