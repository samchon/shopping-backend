import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_customer_create } from "../actors/test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "./internal/generate_random_sale";

export const test_api_shopping_sale_index_search = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_customer_create(pool);

  await ArrayUtil.asyncRepeat(25)(async () => {
    await test_api_shopping_actor_seller_join(pool);
    await generate_random_sale(pool);
  });

  const total: IPage<IShoppingSale.ISummary> =
    await ShoppingApi.functional.shoppings.customers.sales.index(
      pool.customer,
      {
        limit: REPEAT,
        sort: ["-sale.created_at"],
      },
    );
  typia.assertEquals(total);

  const search = TestValidator.search("sales.index")(
    async (input: IShoppingSale.IRequest.ISearch) => {
      const page: IPage<IShoppingSale.ISummary> =
        await ShoppingApi.functional.shoppings.customers.sales.index(
          pool.customer,
          {
            limit: total.data.length,
            search: input,
            sort: ["-sale.created_at"],
          },
        );
      return typia.assertEquals(page).data;
    },
  )(total.data, 4);

  //----
  // IDENTIFIER
  //----
  await search({
    fields: ["channel_codes"],
    values: (sale) => [sale.channels.map((c) => c.code)],
    request: ([channel_codes]) => ({ channel_codes }),
    filter: (sale, [codes]) =>
      sale.channels.some((c) => codes.includes(c.code)),
  });

  if (
    total.data.every(
      (sale) =>
        sale.channels.length &&
        sale.channels.every((c) => c.categories.length > 0),
    )
  )
    await search({
      fields: ["channel_category_ids"],
      values: (sale) => [sale.channels[0].categories.map((c) => c.id)],
      request: ([channel_category_ids]) => ({ channel_category_ids }),
      filter: (sale, [ids]) =>
        sale.channels.some((c) => c.categories.some((c) => ids.includes(c.id))),
    });

  //----
  // CONTENT
  //----
  await search({
    fields: ["sale.content.title"],
    values: (sale) => [RandomGenerator.pick(sale.content.title.split(" "))],
    request: ([title]) => ({ title }),
    filter: (sale, [title]) => sale.content.title.includes(title),
  });
  await search({
    fields: ["tags"],
    values: (sale) => [sale.tags],
    request: ([tags]) => ({ tags }),
    filter: (sale, [tags]) => sale.tags.some((t) => tags.includes(t)),
  });

  //----
  // SELLER
  //----
  await search({
    fields: ["seller.id"],
    values: (sale) => [sale.seller.id],
    request: ([id]) => ({ seller: { id } }),
    filter: (sale, [id]) => sale.seller.id === id,
  });

  await search({
    fields: ["seller.name"],
    values: (sale) => [sale.seller.citizen!.name],
    request: ([name]) => ({ seller: { name } }),
    filter: (sale, [name]) => sale.seller.citizen!.name === name,
  });

  await search({
    fields: ["seller.mobile"],
    values: (sale) => [sale.seller.citizen!.mobile],
    request: ([mobile]) => ({ seller: { mobile } }),
    filter: (sale, [mobile]) => sale.seller.citizen!.mobile === mobile,
  });

  await search({
    fields: ["seller.nickname"],
    values: (sale) => [sale.seller.member.nickname],
    request: ([nickname]) => ({ seller: { nickname } }),
    filter: (sale, [nickname]) =>
      sale.seller.member.nickname.includes(nickname),
  });

  // //----
  // // AGGREGATES
  // //----
  // await search({
  //   fields: ["sale.review.score"],
  //   values: (sale) => [
  //     (sale.aggregate.inquiry.review.statistics?.average ?? 0) * 0.8,
  //     (sale.aggregate.inquiry.review.statistics?.average ?? 0) * 1.2,
  //   ],
  //   request: ([minimum, maximum]) => ({
  //     review: { score: { minimum, maximum } },
  //   }),
  //   filter: (sale, [minimum, maximum]) =>
  //     minimum <= (sale.aggregate.inquiry.review.statistics?.average ?? 0) &&
  //     (sale.aggregate.inquiry.review.statistics?.average ?? 0) <= maximum,
  // });

  // await search({
  //   fields: ["sale.review.count"],
  //   values: (sale) => [
  //     Math.max(0, sale.aggregate.inquiry.review.count - 1),
  //     sale.aggregate.inquiry.review.count + 1,
  //   ],
  //   request: ([minimum, maximum]) => ({
  //     review: { score: { minimum, maximum } },
  //   }),
  //   filter: (sale, [minimum, maximum]) =>
  //     minimum <= sale.aggregate.inquiry.review.count &&
  //     sale.aggregate.inquiry.review.count <= maximum,
  // });
};

const REPEAT = 10;
