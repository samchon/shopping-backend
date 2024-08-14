import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { prepare_random_bbs_article } from "../../../common/internal/prepare_random_bbs_article";

export const generate_random_sale_question = async (
  pool: ConnectionPool,
  sale: IShoppingSale,
  input?: Partial<IShoppingSaleQuestion.ICreate>,
): Promise<IShoppingSaleQuestion> => {
  const question: IShoppingSaleQuestion =
    await ShoppingApi.functional.shoppings.customers.sales.questions.create(
      pool.customer,
      sale.id,
      {
        ...prepare_random_bbs_article(input),
        secret: input?.secret ?? false,
      },
    );
  return question;
};
