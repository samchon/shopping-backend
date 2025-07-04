import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingSaleUnitStockSupplement } from "../../../../../src/api/structures/shoppings/sales/IShoppingSaleUnitStockSupplement";

export const test_api_shoppings_sellers_sales_units_stocks_supplements_index =
  async (connection: api.IConnection) => {
    const output: IPage<IShoppingSaleUnitStockSupplement> =
      await api.functional.shoppings.sellers.sales.units.stocks.supplements.index(
        connection,
        {
          saleId: typia.random<string & Format<"uuid">>(),
          unitId: typia.random<string & Format<"uuid">>(),
          stockId: typia.random<string & Format<"uuid">>(),
          body: typia.random<IShoppingSaleUnitStockSupplement.IRequest>(),
        },
      );
    typia.assert(output);
  };
