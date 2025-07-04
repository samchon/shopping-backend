import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingSaleInquiryComment } from "../../../../../src/api/structures/shoppings/sales/inquiries/IShoppingSaleInquiryComment";

export const test_api_shoppings_sellers_sales_questions_comments_create =
  async (connection: api.IConnection) => {
    const output: IShoppingSaleInquiryComment =
      await api.functional.shoppings.sellers.sales.questions.comments.create(
        connection,
        {
          saleId: typia.random<string & Format<"uuid">>(),
          inquiryId: typia.random<string & Format<"uuid">>(),
          body: typia.random<IShoppingSaleInquiryComment.ICreate>(),
        },
      );
    typia.assert(output);
  };
