import { ArrayUtil, GaffComparator, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderGood } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderGood";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleReview } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleReview";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_customer_join } from "../actors/test_api_shopping_customer_join";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_order } from "../orders/internal/generate_random_order";
import { generate_random_order_publish } from "../orders/internal/generate_random_order_publish";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_sale_review } from "./internal/generate_random_sale_review";

export const test_api_shopping_sale_review_index_sort = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_seller_join(pool);
  const customer: IShoppingCustomer = await test_api_shopping_customer_join(
    pool,
  );

  const sale: IShoppingSale = await generate_random_sale(pool);
  const total: IShoppingSaleReview[] = await ArrayUtil.asyncRepeat(10)(
    async () => {
      const commodity: IShoppingCartCommodity =
        await generate_random_cart_commodity(pool, sale);
      const order: IShoppingOrder = await generate_random_order(pool, [
        commodity,
      ]);
      order.publish = await generate_random_order_publish(
        pool,
        customer,
        order,
        true,
      );

      const good: IShoppingOrderGood = order.goods[0];
      return generate_random_sale_review(pool, sale, good);
    },
  );

  const validator = TestValidator.sort("sort reviews")<
    IShoppingSaleReview.ISummary,
    IShoppingSaleReview.IRequest.SortableColumns,
    IPage.Sort<IShoppingSaleReview.IRequest.SortableColumns>
  >(async (input: IPage.Sort<IShoppingSaleReview.IRequest.SortableColumns>) => {
    const page: IPage<IShoppingSaleReview.ISummary> =
      await ShoppingApi.functional.shoppings.customers.sales.reviews.index(
        pool.customer,
        sale.id,
        {
          sort: input,
          limit: total.length,
        },
      );
    return typia.assertEquals(page).data;
  });

  const components = [
    validator("created_at")(GaffComparator.dates((x) => x.created_at)),
    validator("updated_at")(GaffComparator.dates((x) => x.updated_at)),
    validator("title")(GaffComparator.strings((x) => x.title)),
    validator("score")(GaffComparator.numbers((x) => x.score)),
  ];
  for (const comp of components) {
    await comp("+");
    await comp("-");
  }
};
