import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleQuestion } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleQuestion";

import { ActorPath } from "../../../../../src/typings/ActorPath";
import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_admin_login } from "../actors/test_api_shopping_admin_login";
import { test_api_shopping_customer_join } from "../actors/test_api_shopping_customer_join";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_sale_question } from "./internal/generate_random_sale_question";

export const test_api_shopping_sale_question_secret = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_admin_login(pool);
  await test_api_shopping_customer_join(pool);
  await test_api_shopping_seller_join(pool);

  const sale: IShoppingSale = await generate_random_sale(pool);
  const question: IShoppingSaleQuestion = await generate_random_sale_question(
    pool,
    sale,
  );

  const validate =
    (path: ActorPath) =>
    async (visible: boolean): Promise<void> => {
      if (visible) {
        const read: IShoppingSaleQuestion =
          await ShoppingApi.functional.shoppings[path].sales.questions.at(
            pool.customer,
            sale.id,
            question.id,
          );
        typia.assertEquals(read);
        TestValidator.equals("read")(question)(read);
      } else
        await TestValidator.httpError(`read ${visible}`)(403)(() =>
          ShoppingApi.functional.shoppings[path].sales.questions.at(
            pool.customer,
            sale.id,
            question.id,
          ),
        );

      const page: IPage<IShoppingSaleQuestion.ISummary> =
        await ShoppingApi.functional.shoppings[path].sales.questions.index(
          pool.customer,
          sale.id,
          {
            limit: 1,
          },
        );
      const summary: IShoppingSaleQuestion.ISummary =
        typia.assertEquals(page).data[0];
      const masked = () =>
        summary.customer.citizen!.name.includes("*") &&
        summary.customer.citizen!.mobile.includes("*") &&
        summary.title.includes("*");
      TestValidator.predicate(`page ${visible}`)(
        visible ? masked : () => !masked(),
      );
    };

  await validate("customers")(true);
  await test_api_shopping_customer_join(pool);
  await validate("customers")(false);
  await validate("sellers")(false);
  await validate("admins")(false);
};
