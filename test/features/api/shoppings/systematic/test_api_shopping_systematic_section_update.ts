import { RandomGenerator, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSection } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingSection";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_admin_login } from "../actors/test_api_shopping_admin_login";
import { generate_random_section } from "./internal/generate_random_section";

export const test_api_shopping_systematic_section_create = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_admin_login(pool);

  const section: IShoppingSection = await generate_random_section(pool);
  const name: string = RandomGenerator.name(8);
  await ShoppingApi.functional.shoppings.admins.systematic.sections.update(
    pool.admin,
    section.id,
    {
      name,
    },
  );

  const read: IShoppingSection =
    await ShoppingApi.functional.shoppings.admins.systematic.sections.at(
      pool.admin,
      section.id,
    );
  typia.assertEquals(read);
  TestValidator.equals("update")(name)(read.name);
};
