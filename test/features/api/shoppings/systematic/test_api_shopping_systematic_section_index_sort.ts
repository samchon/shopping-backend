import {
  ArrayUtil,
  GaffComparator,
  RandomGenerator,
  TestValidator,
} from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSection } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingSection";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";

export const test_api_shopping_systematic_section_index_sort = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);
  await ArrayUtil.asyncRepeat(REPEAT)(async () => {
    const section: IShoppingSection =
      await ShoppingApi.functional.shoppings.admins.systematic.sections.create(
        pool.admin,
        {
          code: RandomGenerator.alphabets(8),
          name: RandomGenerator.name(8),
        },
      );
    return section;
  });

  const validator = TestValidator.sort("sections.index")<
    IShoppingSection,
    IShoppingSection.IRequest.SortableColumns,
    IPage.Sort<IShoppingSection.IRequest.SortableColumns>
  >(async (input: IPage.Sort<IShoppingSection.IRequest.SortableColumns>) => {
    const page: IPage<IShoppingSection> =
      await ShoppingApi.functional.shoppings.admins.systematic.sections.index(
        pool.admin,
        {
          limit: REPEAT,
          sort: input,
        },
      );
    return page.data;
  });
  const components = [
    validator("section.code")(GaffComparator.strings((s) => s.code)),
    validator("section.name")(GaffComparator.strings((s) => s.name)),
    validator("section.created_at")(
      GaffComparator.strings((s) => s.created_at),
    ),
  ];
  for (const comp of components) {
    await comp("+");
    await comp("-");
  }
};
const REPEAT = 25;
