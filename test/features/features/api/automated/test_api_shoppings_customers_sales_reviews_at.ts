import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingSaleReview } from "../../../../../src/api/structures/shoppings/sales/inquiries/IShoppingSaleReview";

export const test_api_shoppings_customers_sales_reviews_at = async (
  connection: api.IConnection,
) => {
  const output: IShoppingSaleReview =
    await api.functional.shoppings.customers.sales.reviews.at(connection, {
      saleId: typia.random<string & Format<"uuid">>(),
      id: typia.random<string & Format<"uuid">>(),
    });
  typia.assert(output);
};
