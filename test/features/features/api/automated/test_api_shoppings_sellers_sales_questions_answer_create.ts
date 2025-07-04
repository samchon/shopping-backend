import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IBbsArticle } from "../../../../../src/api/structures/common/IBbsArticle";
import type { IShoppingSaleInquiryAnswer } from "../../../../../src/api/structures/shoppings/sales/inquiries/IShoppingSaleInquiryAnswer";

export const test_api_shoppings_sellers_sales_questions_answer_create = async (
  connection: api.IConnection,
) => {
  const output: IShoppingSaleInquiryAnswer =
    await api.functional.shoppings.sellers.sales.questions.answer.create(
      connection,
      {
        saleId: typia.random<string & Format<"uuid">>(),
        questionId: typia.random<string & Format<"uuid">>(),
        body: typia.random<IBbsArticle.ICreate>(),
      },
    );
  typia.assert(output);
};
