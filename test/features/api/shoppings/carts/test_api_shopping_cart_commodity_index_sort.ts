import { ArrayUtil, GaffComparator, TestValidator } from "@nestia/e2e";
import { randint } from "tstl";
import typia from "typia";

import api from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_create } from "../actors/test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_cart_commodity } from "./internal/generate_random_cart_commodity";
import { prepare_random_cart_commodity } from "./internal/prepare_random_cart_commodity";

export const test_api_shopping_cart_commodity_index_sort = async (
  pool: ConnectionPool,
): Promise<void> => {
  //----
  // PREPARE ASSETS
  //----
  // ACTORS
  await test_api_shopping_actor_seller_join(pool);
  await test_api_shopping_actor_customer_create(pool);

  // SALES AND CART ITEMS
  const sales: IShoppingSale[] = await ArrayUtil.asyncRepeat(REPEAT)(() =>
    generate_random_sale(pool),
  );
  const cart: IShoppingCartCommodity[] = await ArrayUtil.asyncMap(sales)(
    async (s) => {
      const input: IShoppingCartCommodity.ICreate =
        prepare_random_cart_commodity(s);
      input.volume = randint(1, 10);
      for (const stock of input.stocks) stock.quantity = randint(1, 10);
      return generate_random_cart_commodity(pool, s, input);
    },
  );
  typia.assertEquals(cart);

  // SORT VALIDATOR
  const validator = TestValidator.sort("sort")<
    IShoppingCartCommodity,
    IShoppingCartCommodity.IRequest.SortableColumns,
    IPage.Sort<IShoppingCartCommodity.IRequest.SortableColumns>
  >(async (input) => {
    const page: IPage<IShoppingCartCommodity> =
      await api.functional.shoppings.customers.carts.commodities.index(
        pool.customer,
        null,
        {
          limit: cart.length,
          sort: input,
        },
      );
    return typia.assertEquals(page).data;
  });

  //----
  // DO VALIDATE
  //----
  const components = [
    // ITEM
    validator("commodity.price")(GaffComparator.numbers((x) => x.price.real)),
    validator("commodity.volume")(GaffComparator.numbers((x) => x.volume)),
    validator("commodity.volumed_price")(
      GaffComparator.numbers((x) => x.price.real * x.volume),
    ),
    validator("commodity.created_at")(
      GaffComparator.dates((x) => x.created_at),
    ),

    // SELLER
    validator("seller.created_at")(
      GaffComparator.dates((x) => x.sale.seller.created_at),
    ),
    // validator("seller.goods.payments.real")(
    //   GaffComparator.numbers(
    //     (x) => x.sale.seller.aggregate.good.real_payment_amount,
    //   ),
    // ),
    // validator("seller.goods.publish_count")(
    //   GaffComparator.numbers((x) => x.sale.seller.aggregate.good.publish_count),
    // ),
    // validator("seller.reviews.average")(
    //   GaffComparator.numbers(
    //     (x) => x.sale.seller.aggregate.inquiry.review.statistics?.average ?? 0,
    //   ),
    //   (x) => x.sale.seller.aggregate.inquiry.review.statistics !== null,
    // ),
    // validator("seller.reviews.count")(
    //   GaffComparator.numbers(
    //     (x) => x.sale.seller.aggregate.inquiry.review.count,
    //   ),
    // ),

    // // SALE
    // validator("goods.publish_count")(
    //   GaffComparator.numbers((x) => x.sale.aggregate.good.publish_count),
    // ),
    // validator("goods.payments.real")(
    //   GaffComparator.numbers((x) => x.sale.aggregate.good.real_payment_amount),
    // ),
    // validator("reviews.average")(
    //   GaffComparator.numbers(
    //     (x) => x.sale.aggregate.inquiry.review.statistics?.average ?? 0,
    //   ),
    //   (x) => x.sale.aggregate.inquiry.review.statistics !== null,
    // ),
    // validator("reviews.count")(
    //   GaffComparator.numbers((x) => x.sale.aggregate.inquiry.review.count),
    // ),
    // validator("reviews.average", "reviews.count")(
    //   GaffComparator.numbers((x) => [
    //     x.sale.aggregate.inquiry.review.statistics?.average ?? 0,
    //     x.sale.aggregate.inquiry.review.count,
    //   ]),
    //   (x) => x.sale.aggregate.inquiry.review.statistics !== null,
    // ),
    validator("sale.created_at")(
      GaffComparator.dates((x) => x.sale.created_at),
    ),
    validator("sale.updated_at")(
      GaffComparator.dates((x) => x.sale.updated_at),
    ),
    validator("sale.opened_at")(GaffComparator.dates((x) => x.sale.opened_at!)),
    validator("sale.content.title")(
      GaffComparator.strings((x) => x.sale.content.title),
    ),
  ];
  for (const comp of components) {
    await comp("+");
    await comp("-");
  }
};

const REPEAT = 25;
