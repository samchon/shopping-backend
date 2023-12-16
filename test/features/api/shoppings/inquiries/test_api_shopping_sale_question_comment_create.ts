import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleInquiryComment } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleInquiryComment";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_admin_login } from "../actors/test_api_shopping_admin_login";
import { test_api_shopping_customer_join } from "../actors/test_api_shopping_customer_join";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_sale_inquiry_comment } from "./internal/generate_random_sale_inquiry_comment";
import { generate_random_sale_question } from "./internal/generate_random_sale_question";

export const test_api_shopping_sale_question_comment_create = async (
  pool: ConnectionPool,
): Promise<void> => {
  const admin: IShoppingAdministrator.IInvert =
    await test_api_shopping_admin_login(pool);
  const customer: IShoppingCustomer = await test_api_shopping_customer_join(
    pool,
  );
  const seller: IShoppingSeller.IInvert = await test_api_shopping_seller_join(
    pool,
  );

  const sale: IShoppingSale = await generate_random_sale(pool);
  const question: IShoppingSaleQuestion = await generate_random_sale_question(
    pool,
    sale,
  );
  const generator = generate_random_sale_inquiry_comment({
    pool,
    sale,
    inquiry: question,
  });

  const comments: [
    IShoppingSaleInquiryComment,
    IShoppingSaleInquiryComment,
    IShoppingSaleInquiryComment,
  ] = [
    await generator(admin),
    await generator(customer),
    await generator(seller),
  ];
  TestValidator.equals("of_admin")(comments[0].writer)(admin);
  TestValidator.equals("of_customer")(comments[1].writer)(customer);
  TestValidator.equals("of_seller")(comments[2].writer)(seller);

  const page: IPage<IShoppingSaleInquiryComment> =
    await ShoppingApi.functional.shoppings.customers.sales.questions.comments.index(
      pool.customer,
      sale.id,
      question.id,
      {
        limit: 3,
        sort: ["+created_at"],
      },
    );
  TestValidator.equals("page")(page.data)(comments);
};
