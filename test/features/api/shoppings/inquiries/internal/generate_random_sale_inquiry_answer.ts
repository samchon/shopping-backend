import { RandomGenerator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleInquiry } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiry";
import { IShoppingSaleInquiryAnswer } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiryAnswer";

import { ConnectionPool } from "../../../../../ConnectionPool";

export const generate_random_sale_inquiry_answer = async (
  pool: ConnectionPool,
  sale: IShoppingSale,
  question: IShoppingSaleInquiry<any, any>,
  input?: Partial<IShoppingSaleInquiryAnswer.ICreate>,
): Promise<IShoppingSaleInquiryAnswer> => {
  const answer: IShoppingSaleInquiryAnswer =
    await ShoppingApi.functional.shoppings.sellers.sales.questions.answer.create(
      pool.seller,
      sale.id,
      question.id,
      {
        title: RandomGenerator.paragraph()(),
        body: RandomGenerator.content()()(),
        format: "txt",
        files: [],
        ...input,
      },
    );
  return typia.assertEquals(answer);
};
