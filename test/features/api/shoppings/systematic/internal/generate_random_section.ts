import { RandomGenerator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSection } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingSection";

import { ConnectionPool } from "../../../../../ConnectionPool";

export const generate_random_section = async (
  pool: ConnectionPool,
  input?: Partial<IShoppingSection.ICreate>
): Promise<IShoppingSection> => {
  const section: IShoppingSection =
    await ShoppingApi.functional.shoppings.admins.systematic.sections.create(
      pool.admin,
      {
        code: RandomGenerator.alphabets(16),
        name: RandomGenerator.name(8),
        ...input,
      }
    );
  return section;
};
