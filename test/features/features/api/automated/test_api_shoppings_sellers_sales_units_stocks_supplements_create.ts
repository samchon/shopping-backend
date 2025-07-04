import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingSaleUnitStockSupplement } from "../../../../../src/api/structures/shoppings/sales/IShoppingSaleUnitStockSupplement";

export const test_api_shoppings_sellers_sales_units_stocks_supplements_create =
  async (connection: api.IConnection) => {
    const output: IShoppingSaleUnitStockSupplement =
      await api.functional.shoppings.sellers.sales.units.stocks.supplements.create(
        connection,
        {
          saleId: typia.random<string & Format<"uuid">>(),
          unitId: typia.random<string & Format<"uuid">>(),
          stockId: typia.random<string & Format<"uuid">>(),
          body: typia.random<IShoppingSaleUnitStockSupplement.ICreate>(),
        },
      );
    typia.assert(output);
  };
