import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingSaleReview } from "../../../../../src/api/structures/shoppings/sales/inquiries/IShoppingSaleReview";

export const test_api_shoppings_customers_sales_reviews_index = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingSaleReview.ISummary> =
    await api.functional.shoppings.customers.sales.reviews.index(connection, {
      saleId: typia.random<string & Format<"uuid">>(),
      body: typia.random<IShoppingSaleReview.IRequest>(),
    });
  typia.assert(output);
};
