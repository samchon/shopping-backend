import { ArrayUtil, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderGood } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderGood";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleReview } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleReview";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_cart_commodity } from "../carts/internal/generate_random_cart_commodity";
import { generate_random_order } from "../orders/internal/generate_random_order";
import { generate_random_order_publish } from "../orders/internal/generate_random_order_publish";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_sale_review } from "./internal/generate_random_sale_review";

export const test_api_shopping_sale_review_index_search = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  const total: IShoppingSaleReview[] = await ArrayUtil.asyncRepeat(
    10,
    async () => {
      const customer: IShoppingCustomer =
        await test_api_shopping_actor_customer_join(pool);
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
  const expected: IPage<IShoppingSaleReview.ISummary> =
    await ShoppingApi.functional.shoppings.customers.sales.reviews.index(
      pool.customer,
      sale.id,
      {
        limit: total.length,
      },
    );

  const search = TestValidator.search(
    "search",
    async (search: IShoppingSaleReview.IRequest.ISearch) => {
      const page: IPage<IShoppingSaleReview.ISummary> =
        await ShoppingApi.functional.shoppings.customers.sales.reviews.index(
          pool.customer,
          sale.id,
          {
            search,
            limit: total.length,
          },
        );
      return page.data;
    },
    expected.data,
    2,
  );

  await search({
    fields: ["name"],
    values: (arc) => [arc.customer.citizen!.name],
    request: ([name]) => ({ name }),
    filter: (arc, [name]) => arc.customer.citizen!.name === name,
  });
  await search({
    fields: ["nickname"],
    values: (arc) => [
      arc.customer.member?.nickname ??
        arc.customer.external_user?.nickname ??
        "",
    ],
    request: ([nickname]) => ({ nickname }),
    filter: (arc, [nickname]) =>
      (
        arc.customer.member?.nickname ?? arc.customer.external_user?.nickname
      )?.includes(nickname) ?? false,
  });
  await search({
    fields: ["title"],
    values: (arc) => [arc.title],
    request: ([title]) => ({ title }),
    filter: (arc, [title]) => arc.title.includes(title),
  });
  await search({
    fields: ["minimum", "minimum"],
    values: (arc) => [
      Math.max(0, arc.score * 0.9),
      Math.min(100, arc.score * 1.1),
    ],
    request: ([minimum, maximum]) => ({ minimum, maximum }),
    filter: (arc, [minimum, maximum]) =>
      minimum <= arc.score && arc.score <= maximum,
  });
  for (const flag of [true, false])
    await search({
      fields: ["answered"],
      values: () => [flag],
      request: ([answered]) => ({ answered }),
      filter: (arc, [answered]) => !!arc.answer === answered,
    });
  await search({
    fields: ["answered"],
    values: () => [null],
    request: ([answered]) => ({ answered }),
    filter: () => true,
  });
};
