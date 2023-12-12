import { ArrayUtil, TestValidator } from "@nestia/e2e";
import { randint } from "tstl";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingDepositHistory } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositHistory";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_admin_login } from "../actors/test_api_hub_admin_login";
import { test_api_shopping_customer_join } from "../actors/test_api_shopping_customer_join";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_deposit_histories } from "./internal/generate_random_deposit_histories";

export const test_api_shopping_deposit_histories_index_search = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_admin_login(pool);
  await test_api_shopping_customer_join(pool);
  await test_api_shopping_seller_join(pool);

  await ArrayUtil.asyncRepeat(10)(() =>
    generate_random_deposit_histories(pool, {
      charge: randint(1_000, 9_000),
      discount: randint(100, 999),
    }),
  );

  const entire: IPage<IShoppingDepositHistory> =
    await ShoppingApi.functional.shoppings.customers.deposits.histories.index(
      pool.customer,
      {
        limit: 100,
      },
    );
  const validator = TestValidator.search("search")(
    async (input: IShoppingDepositHistory.IRequest.ISearch) => {
      const page: IPage<IShoppingDepositHistory> =
        await ShoppingApi.functional.shoppings.customers.deposits.histories.index(
          pool.customer,
          {
            limit: 100,
            search: input,
          },
        );
      return typia.assertEquals(page).data;
    },
  )(entire.data, 5);

  await validator({
    fields: ["deposit.code"],
    values: (history) => [history.deposit.code],
    filter: (history, [code]) => history.deposit.code === code,
    request: ([code]) => ({ deposit: { code } }),
  });
  await validator({
    fields: ["deposit.direction"],
    values: (history) => [history.deposit.direction],
    filter: (history, [direction]) => history.deposit.direction === direction,
    request: ([direction]) => ({ deposit: { direction } }),
  });
  await validator({
    fields: ["from", "to"],
    values: (history) => [history.created_at, history.created_at],
    filter: (history, [from, to]) =>
      history.created_at >= from && history.created_at <= to,
    request: ([from, to]) => ({ from, to }),
  });
};
