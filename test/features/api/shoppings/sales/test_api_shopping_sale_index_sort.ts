import { ArrayUtil, GaffComparator, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
// import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
// import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
// import { IShoppingOrderGood } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderGood";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_create } from "../actors/test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
// import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
// import { generate_random_order } from "../orders/internal/generate_random_order";
// import { generate_random_order_publish } from "../orders/internal/generate_random_order_publish";
import { generate_random_sale } from "./internal/generate_random_sale";

// import { generate_random_sale_review } from "./internal/generate_random_sale_review";

export const test_api_shopping_sale_index_sort = async (
  pool: ConnectionPool
): Promise<void> => {
  await test_api_shopping_actor_seller_join(pool);
  const customer: IShoppingCustomer =
    await test_api_shopping_actor_customer_create(pool);

  await ArrayUtil.asyncRepeat(REPEAT)(async () => {
    const sale: IShoppingSale = await generate_random_sale(pool);
    customer;
    sale;
    // const commodity: IShoppingCartCommodity =
    //   await generate_random_cart_commodity(pool, sale);
    // const order: IShoppingOrder = await generate_random_order(pool, [
    //   commodity,
    // ]);
    // order.publish = await generate_random_order_publish(
    //   pool,
    //   customer,
    //   order,
    //   true,
    // );
    // const good: IShoppingOrderGood = order.goods[0];
    // await generate_random_sale_review(pool, sale, good);
  });

  // PREPARE VALIDATOR
  const validator = TestValidator.sort("sort")<
    IShoppingSale.ISummary,
    IShoppingSale.IRequest.SortableColumns,
    IPage.Sort<IShoppingSale.IRequest.SortableColumns>
  >(async (sort) => {
    const page: IPage<IShoppingSale.ISummary> =
      await ShoppingApi.functional.shoppings.customers.sales.index(
        pool.customer,
        {
          limit: 5,
          sort,
        }
      );
    return page.data;
  });

  const components = [
    // SELLER
    validator("seller.created_at")(
      GaffComparator.dates((x) => x.seller.created_at)
    ),
    // validator("seller.goods.payments.real")(
    //   GaffComparator.numbers(
    //     (x) => x.seller.aggregate.good.real_payment_amount,
    //   ),
    // ),
    // validator("seller.goods.publish_count")(
    //   GaffComparator.numbers((x) => x.seller.aggregate.good.publish_count),
    // ),
    // validator("seller.reviews.average")(
    //   GaffComparator.numbers(
    //     (x) => x.seller.aggregate.inquiry.review.statistics!.average,
    //   ),
    //   (x) => x.seller.aggregate.inquiry.review.statistics !== null,
    // ),
    // validator("seller.reviews.count")(
    //   GaffComparator.numbers((x) => x.seller.aggregate.inquiry.review.count),
    // ),

    // // SALE
    // validator("goods.publish_count")(
    //   GaffComparator.numbers((x) => x.aggregate.good.publish_count),
    // ),
    // validator("goods.payments.real")(
    //   GaffComparator.numbers((x) => x.aggregate.good.real_payment_amount),
    // ),
    // validator("reviews.average")(
    //   GaffComparator.numbers(
    //     (x) => x.aggregate.inquiry.review.statistics!.average,
    //   ),
    //   (x) => x.aggregate.inquiry.review.statistics !== null,
    // ),
    // validator("reviews.count")(
    //   GaffComparator.numbers((x) => x.aggregate.inquiry.review.count),
    // ),
    // validator("reviews.average", "reviews.count")(
    //   GaffComparator.numbers((x) => [
    //     x.aggregate.inquiry.review.statistics!.average,
    //     x.aggregate.inquiry.review.count,
    //   ]),
    //   (x) => x.aggregate.inquiry.review.statistics !== null,
    // ),
    validator("sale.created_at")(GaffComparator.dates((x) => x.created_at)),
    validator("sale.updated_at")(GaffComparator.dates((x) => x.updated_at)),
    validator("sale.opened_at")(GaffComparator.dates((x) => x.opened_at!)),
    validator("sale.content.title")(
      GaffComparator.strings((x) => x.content.title)
    ),
    // PRICE-RANGE
    validator("sale.price_range.lowest.real")(
      GaffComparator.numbers((x) => x.price_range.lowest.real)
    ),
    validator("sale.price_range.highest.real")(
      GaffComparator.numbers((x) => x.price_range.highest.real)
    ),
  ];
  for (const comp of components) {
    await comp("+");
    await comp("-");
  }
};

const REPEAT = 10;
