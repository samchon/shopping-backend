import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingSaleInquiryComment } from "../../../../../src/api/structures/shoppings/sales/inquiries/IShoppingSaleInquiryComment";

export const test_api_shoppings_admins_sales_reviews_comments_at = async (
  connection: api.IConnection,
) => {
  const output: IShoppingSaleInquiryComment =
    await api.functional.shoppings.admins.sales.reviews.comments.at(
      connection,
      {
        saleId: typia.random<string & Format<"uuid">>(),
        inquiryId: typia.random<string & Format<"uuid">>(),
        id: typia.random<string & Format<"uuid">>(),
      },
    );
  typia.assert(output);
};
