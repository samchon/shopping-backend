import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingSaleReview } from "../../../../../src/api/structures/shoppings/sales/inquiries/IShoppingSaleReview";

export const test_api_shoppings_customers_sales_reviews_create = async (
  connection: api.IConnection,
) => {
  const output: IShoppingSaleReview =
    await api.functional.shoppings.customers.sales.reviews.create(connection, {
      saleId: typia.random<string & Format<"uuid">>(),
      body: typia.random<IShoppingSaleReview.ICreate>(),
    });
  typia.assert(output);
};
