import { ArrayUtil, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleInquiryComment } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiryComment";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ConnectionPool } from "../../../../ConnectionPool";
import { prepare_random_bbs_article_comment } from "../../common/internal/prepare_random_bbs_article_comment";
import { test_api_shopping_customer_join } from "../actors/test_api_shopping_customer_join";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_sale_inquiry_comment } from "./internal/generate_random_sale_inquiry_comment";
import { generate_random_sale_question } from "./internal/generate_random_sale_question";

export const test_api_shopping_sale_question_comment_update = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_seller_join(pool);
  const customer: IShoppingCustomer = await test_api_shopping_customer_join(
    pool,
  );

  const sale: IShoppingSale = await generate_random_sale(pool);
  const question: IShoppingSaleQuestion = await generate_random_sale_question(
    pool,
    sale,
  );
  const comment: IShoppingSaleInquiryComment =
    await generate_random_sale_inquiry_comment({
      pool,
      sale,
      inquiry: question,
    })(customer);

  comment.snapshots.push(
    ...(await ArrayUtil.asyncRepeat(4)(async () => {
      const snapshot: IShoppingSaleInquiryComment.ISnapshot =
        await ShoppingApi.functional.shoppings.customers.sales.questions.comments.update(
          pool.customer,
          sale.id,
          question.id,
          comment.id,
          prepare_random_bbs_article_comment(),
        );
      return typia.assertEquals(snapshot);
    })),
  );

  const read: IShoppingSaleInquiryComment =
    await ShoppingApi.functional.shoppings.customers.sales.questions.comments.at(
      pool.customer,
      sale.id,
      question.id,
      comment.id,
    );
  typia.assertEquals(read);
  TestValidator.equals("read")(read)(comment);
};
