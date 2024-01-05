import { ArrayUtil, GaffComparator, TestValidator } from "@nestia/e2e";
import { randint } from "tstl";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingDepositHistory } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositHistory";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_deposit_histories } from "./internal/generate_random_deposit_histories";

export const test_api_shopping_deposit_histories_index_sort = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_customer_join(pool);
  await test_api_shopping_actor_seller_join(pool);

  await ArrayUtil.asyncRepeat(10)(() =>
    generate_random_deposit_histories(pool, {
      charge: randint(1_000, 9_000),
      discount: randint(100, 999),
    }),
  );

  const validator = TestValidator.sort("sort")<
    IShoppingDepositHistory,
    IShoppingDepositHistory.IRequest.SortableColumns,
    IPage.Sort<IShoppingDepositHistory.IRequest.SortableColumns>
  >(async (input) => {
    const page: IPage<IShoppingDepositHistory> =
      await ShoppingApi.functional.shoppings.customers.deposits.histories.index(
        pool.customer,
        {
          limit: 100,
          sort: input,
        },
      );
    return typia.assertEquals(page).data;
  });

  const components = [
    validator("deposit.code")(GaffComparator.strings((x) => x.deposit.code)),
    validator("history.value")(GaffComparator.numbers((x) => x.value)),
    validator("history.created_at")(GaffComparator.dates((x) => x.created_at)),
  ];
  for (const comp of components) {
    await comp("+");
    await comp("-");
  }
};
