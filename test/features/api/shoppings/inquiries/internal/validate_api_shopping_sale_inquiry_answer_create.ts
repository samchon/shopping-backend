import { TestValidator } from "@nestia/e2e";
import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleInquiry } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiry";
import { IShoppingSaleInquiryAnswer } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiryAnswer";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { prepare_random_bbs_article } from "../../../common/internal/prepare_random_bbs_article";

export const validate_api_shopping_sale_inquiry_answer_create =
  <Inquiry extends IShoppingSaleInquiry<any, any>>(accessor: {
    read: (
      connection: ShoppingApi.IConnection,
      saleId: string,
      inquiryId: string
    ) => Promise<Inquiry>;
    create: (
      connection: ShoppingApi.IConnection,
      saleId: string,
      inquiryId: string,
      input: IShoppingSaleInquiryAnswer.ICreate
    ) => Promise<IShoppingSaleInquiryAnswer>;
  }) =>
  async (
    pool: ConnectionPool,
    sale: IShoppingSale,
    inquiry: Inquiry
  ): Promise<void> => {
    TestValidator.equals("not answered yet")(inquiry.answer)(null);

    const answer: IShoppingSaleInquiryAnswer = await accessor.create(
      pool.seller,
      sale.id,
      inquiry.id,
      prepare_random_bbs_article()
    );
    inquiry.answer = answer;

    const read: Inquiry = await accessor.read(
      pool.customer,
      sale.id,
      inquiry.id
    );
    TestValidator.equals("read")(inquiry)(read);
  };
