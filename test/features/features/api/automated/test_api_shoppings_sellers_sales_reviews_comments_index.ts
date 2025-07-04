import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IPage } from "../../../../../src/api/structures/common/IPage";
import type { IShoppingSaleInquiryComment } from "../../../../../src/api/structures/shoppings/sales/inquiries/IShoppingSaleInquiryComment";

export const test_api_shoppings_sellers_sales_reviews_comments_index = async (
  connection: api.IConnection,
) => {
  const output: IPage<IShoppingSaleInquiryComment> =
    await api.functional.shoppings.sellers.sales.reviews.comments.index(
      connection,
      {
        saleId: typia.random<string & Format<"uuid">>(),
        inquiryId: typia.random<string & Format<"uuid">>(),
        body: typia.random<IShoppingSaleInquiryComment.IRequest>(),
      },
    );
  typia.assert(output);
};
