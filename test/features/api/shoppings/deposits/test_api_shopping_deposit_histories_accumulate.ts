import { ArrayUtil, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingDepositHistory } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositHistory";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_deposit_histories } from "./internal/generate_random_deposit_histories";

export const test_api_shopping_deposit_histories_accumulate = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_customer_join(pool);
  await test_api_shopping_actor_seller_join(pool);

  await ArrayUtil.asyncRepeat(3)(() =>
    generate_random_deposit_histories(pool, {
      charge: 1_000,
      discount: 300,
    }),
  );

  const histories: IPage<IShoppingDepositHistory> =
    await ShoppingApi.functional.shoppings.customers.deposits.histories.index(
      pool.customer,
      {
        limit: 100,
        sort: ["+history.created_at"],
      },
    );
  typia.assertEquals(histories);

  TestValidator.equals("histories[].value")(
    histories.data.map((history) => history.value * history.deposit.direction),
  )(ArrayUtil.repeat(3)(() => [1_000, -300]).flat());

  TestValidator.equals("histories[].balance")(
    histories.data.map((history) => history.balance),
  )(
    histories.data.map(
      (history, i) =>
        history.value * history.deposit.direction +
        histories.data
          .slice(0, i)
          .map((history) => history.value * history.deposit.direction)
          .reduce((a, b) => a + b, 0),
    ),
  );
};
