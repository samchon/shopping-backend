import { ArrayUtil, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSection } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingSection";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { generate_random_section } from "./internal/generate_random_section";

export const test_api_shopping_systematic_section_index_search = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);

  const sectionList: IShoppingSection[] = await ArrayUtil.asyncRepeat(
    REPEAT,
    () => generate_random_section(pool),
  );
  const search = TestValidator.search(
    "sales.index",
    async (input: IShoppingSection.IRequest.ISearch) => {
      const page: IPage<IShoppingSection> =
        await ShoppingApi.functional.shoppings.admins.systematic.sections.index(
          pool.admin,
          {
            limit: sectionList.length,
            search: input,
            sort: ["-section.created_at"],
          },
        );
      return page.data;
    },
    sectionList,
    4,
  );

  await search({
    fields: ["sectiob.name"],
    values: (section) => [section.name],
    request: ([name]) => ({ name }),
    filter: (section, [name]) => section.name.includes(name),
  });
};

const REPEAT = 25;
