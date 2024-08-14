import { ArrayUtil, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_sale_question } from "./internal/generate_random_sale_question";

export const test_api_shopping_sale_question_index_search = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  const total: IShoppingSaleQuestion[] = await ArrayUtil.asyncRepeat(10)(
    async () => {
      await test_api_shopping_actor_customer_join(pool);
      return generate_random_sale_question(pool, sale);
    },
  );
  const expected: IPage<IShoppingSaleQuestion.ISummary> =
    await ShoppingApi.functional.shoppings.customers.sales.questions.index(
      pool.customer,
      sale.id,
      {
        limit: total.length,
      },
    );

  const search = TestValidator.search("search")(
    async (search: IShoppingSaleQuestion.IRequest.ISearch) => {
      const page: IPage<IShoppingSaleQuestion.ISummary> =
        await ShoppingApi.functional.shoppings.customers.sales.questions.index(
          pool.customer,
          sale.id,
          {
            search,
            limit: total.length,
          },
        );
      return page.data;
    },
  )(expected.data, 2);

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
