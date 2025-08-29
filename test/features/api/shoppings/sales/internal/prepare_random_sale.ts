import { ArrayUtil, RandomGenerator } from "@nestia/e2e";
import { randint } from "tstl";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingChannel } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannel";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { TestGlobal } from "../../../../../TestGlobal";
import { prepare_random_attachment_file } from "../../../common/internal/prepare_random_attachment_file";
import { prepare_random_sale_unit } from "./prepare_random_sale_unit";

export const prepare_random_sale = async (
  pool: ConnectionPool,
  input?: Partial<IShoppingSale.ICreate>,
): Promise<IShoppingSale.ICreate> => ({
  section_code: TestGlobal.SECTION,
  category_codes: await categories(pool),
  units: ArrayUtil.repeat(randint(1, 3), () => prepare_random_sale_unit()),
  content: {
    title: RandomGenerator.paragraph(),
    body: RandomGenerator.content(),
    format: "txt",
    files: ArrayUtil.repeat(randint(0, 3), () =>
      prepare_random_attachment_file(),
    ),
    thumbnails: ArrayUtil.repeat(randint(1, 3), () =>
      prepare_random_attachment_file(),
    ),
  },
  opened_at: new Date().toISOString(),
  closed_at: null,
  tags: [],
  ...(input ?? {}),
});

const categories = async (pool: ConnectionPool): Promise<string[]> => {
  const channel: IShoppingChannel.IHierarchical =
    await ShoppingApi.functional.shoppings.sellers.systematic.channels.get(
      pool.seller,
      pool.channel,
    );
  return channel.categories.map((c) => c.code);
};
