import { ArrayUtil, RandomGenerator } from "@nestia/e2e";
import { randint } from "tstl";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleChannel } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleChannel";
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
  channels: await channels(pool),
  units: ArrayUtil.repeat(randint(1, 3))(() => prepare_random_sale_unit()),
  content: {
    title: RandomGenerator.paragraph()(),
    body: RandomGenerator.content()()(),
    format: "txt",
    files: ArrayUtil.repeat(randint(3, 10))(() =>
      prepare_random_attachment_file(),
    ),
    thumbnails: ArrayUtil.repeat(randint(3, 10))(() =>
      prepare_random_attachment_file(),
    ),
  },
  opened_at: new Date().toISOString(),
  closed_at: null,
  tags: [],
  ...(input ?? {}),
});

const channels = async (
  pool: ConnectionPool,
): Promise<IShoppingSaleChannel.ICreate[]> => {
  const page: IPage<IShoppingChannel.IHierarchical> =
    await ShoppingApi.functional.shoppings.sellers.systematic.channels.hierarchical(
      pool.seller,
      {
        limit: 1,
        search: {
          code: TestGlobal.CHANNEL,
        },
      },
    );
  return typia.assertEquals(page).data.map((elem) => ({
    code: elem.code,
    category_ids: [RandomGenerator.pick(page.data[0].categories).id],
  }));
};
