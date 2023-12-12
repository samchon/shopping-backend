import { ArrayUtil, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMileageHistory } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileageHistory";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_admin_login } from "../actors/test_api_hub_admin_login";
import { test_api_shopping_customer_join } from "../actors/test_api_shopping_customer_join";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_mileage_histories } from "./internal/generate_random_mileage_histories";

export const test_api_shopping_mileage_histories_index_search = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_admin_login(pool);
  await test_api_shopping_seller_join(pool);
  const customer: IShoppingCustomer = await test_api_shopping_customer_join(
    pool,
  );

  await ArrayUtil.asyncRepeat(10)(() =>
    generate_random_mileage_histories(pool, customer),
  );

  const entire: IPage<IShoppingMileageHistory> =
    await ShoppingApi.functional.shoppings.customers.mileages.histories.index(
      pool.customer,
      {
        limit: 100,
      },
    );
  const validator = TestValidator.search("search")(
    async (input: IShoppingMileageHistory.IRequest.ISearch) => {
      const page: IPage<IShoppingMileageHistory> =
        await ShoppingApi.functional.shoppings.customers.mileages.histories.index(
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
    fields: ["mileage.code"],
    values: (history) => [history.mileage.code],
    filter: (history, [code]) => history.mileage.code === code,
    request: ([code]) => ({ mileage: { code } }),
  });
  await validator({
    fields: ["mileage.direction"],
    values: (history) => [history.mileage.direction],
    filter: (history, [direction]) => history.mileage.direction === direction,
    request: ([direction]) => ({ mileage: { direction } }),
  });
  await validator({
    fields: ["from", "to"],
    values: (history) => [history.created_at, history.created_at],
    filter: (history, [from, to]) =>
      history.created_at >= from && history.created_at <= to,
    request: ([from, to]) => ({ from, to }),
  });
};
