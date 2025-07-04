import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingSaleReview } from "../../../../../src/api/structures/shoppings/sales/inquiries/IShoppingSaleReview";

export const test_api_shoppings_customers_sales_reviews_update = async (
  connection: api.IConnection,
) => {
  const output: IShoppingSaleReview.ISnapshot =
    await api.functional.shoppings.customers.sales.reviews.update(connection, {
      saleId: typia.random<string & Format<"uuid">>(),
      id: typia.random<string & Format<"uuid">>(),
      body: typia.random<IShoppingSaleReview.IUpdate>(),
    });
  typia.assert(output);
};
