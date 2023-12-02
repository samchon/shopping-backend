import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSection } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingSection";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_admin_login } from "../actors/test_api_hub_admin_login";
import { test_api_shopping_customer_create } from "../actors/test_api_shopping_customer_create";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_sale } from "../sales/internal/generate_random_sale";
import { generate_random_section } from "./internal/generate_random_section";

export const test_api_shopping_systematic_section_merge = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_admin_login(pool);
  await test_api_shopping_customer_create(pool);
  await test_api_shopping_seller_join(pool);

  const prefix: string = RandomGenerator.alphabets(8);
  const sectionList: IShoppingSection[] = await ArrayUtil.asyncRepeat(REPEAT)(
    () =>
      generate_random_section(pool, {
        code: `${prefix}-${RandomGenerator.name(8)}`,
      }),
  );
  await ArrayUtil.asyncForEach(sectionList)((section) =>
    generate_random_sale(pool, { section_code: section.code }),
  );

  await ShoppingApi.functional.shoppings.admins.systematic.sections.merge(
    pool.admin,
    {
      keep: sectionList[0].id,
      absorbed: sectionList.slice(1).map((section) => section.id),
    },
  );

  const sectionPage: IPage<IShoppingSection> =
    await ShoppingApi.functional.shoppings.customers.systematic.sections.index(
      pool.customer,
      {
        limit: REPEAT,
        search: {
          code: prefix,
        },
      },
    );
  typia.assertEquals(sectionPage);
  TestValidator.equals("merge")(1)(sectionPage.data.length);

  const salePage: IPage<IShoppingSale.ISummary> =
    await ShoppingApi.functional.shoppings.customers.sales.index(
      pool.customer,
      {
        limit: REPEAT,
        sort: ["-sale.created_at"],
      },
    );
  typia.assertEquals(salePage);
  salePage.data.forEach((sale) =>
    TestValidator.equals("sale.section")(sectionList[0])(sale.section),
  );
};

const REPEAT = 4;
