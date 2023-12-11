import { randint } from "tstl";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingOrderGood } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderGood";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleReview } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleReview";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { prepare_random_bbs_article } from "../../../common/internal/prepare_random_bbs_article";

export const generate_random_sale_review = async (
  pool: ConnectionPool,
  sale: IShoppingSale,
  good: IShoppingOrderGood,
  input?: Partial<IShoppingSaleReview.ICreate>,
): Promise<IShoppingSaleReview> => {
  const review: IShoppingSaleReview =
    await ShoppingApi.functional.shoppings.customers.sales.reviews.create(
      pool.customer,
      sale.id,
      {
        ...prepare_random_bbs_article(),
        score: randint(0, 10) * 10,
        good_id: good.id,
        ...input,
      },
    );
  return typia.assertEquals(review);
};
