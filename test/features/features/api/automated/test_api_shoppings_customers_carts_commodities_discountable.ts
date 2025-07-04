import typia from "typia";

import api from "../../../../../src/api";
import type { IShoppingCartDiscountable } from "../../../../../src/api/structures/shoppings/orders/IShoppingCartDiscountable";

export const test_api_shoppings_customers_carts_commodities_discountable =
  async (connection: api.IConnection) => {
    const output: IShoppingCartDiscountable =
      await api.functional.shoppings.customers.carts.commodities.discountable(
        connection,
        {
          body: typia.random<IShoppingCartDiscountable.IRequest>(),
        },
      );
    typia.assert(output);
  };
