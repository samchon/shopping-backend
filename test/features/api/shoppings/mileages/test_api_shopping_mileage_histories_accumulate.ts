import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMileageHistory } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileageHistory";

import { ShoppingConfiguration } from "../../../../../src/ShoppingConfiguration";
import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_admin_login } from "../actors/test_api_shopping_admin_login";
import { test_api_shopping_customer_join } from "../actors/test_api_shopping_customer_join";
import { test_api_shopping_seller_join } from "../actors/test_api_shopping_seller_join";
import { generate_random_mileage_histories } from "./internal/generate_random_mileage_histories";

export const test_api_shopping_mileage_histories_accumulate = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_admin_login(pool);
  await test_api_shopping_seller_join(pool);
  const customer: IShoppingCustomer = await test_api_shopping_customer_join(
    pool,
  );
  const { donation, good } = await generate_random_mileage_histories(
    pool,
    customer,
  );

  const histories: IPage<IShoppingMileageHistory> =
    await ShoppingApi.functional.shoppings.customers.mileages.histories.index(
      pool.customer,
      {
        limit: 100,
        sort: ["+history.created_at"],
      },
    );
  typia.assertEquals(histories);

  TestValidator.equals("histories[].value")(
    histories.data.map((history) => history.value * history.mileage.direction),
  )([
    donation.value,
    -donation.value,
    ShoppingConfiguration.MILEAGE_REWARDS.PHOTO_REVIEW,
    good.price.real *
      ShoppingConfiguration.MILEAGE_REWARDS.ORDER_GOOD_CONFIRM_PERCENTAGE,
  ]);

  TestValidator.equals("histories[].balance")(
    histories.data.map(
      (history) => history.balance * history.mileage.direction,
    ),
  )(
    histories.data.map(
      (history, i) =>
        history.balance +
        histories.data
          .slice(0, i - 1)
          .map((history) => history.balance * history.mileage.direction)
          .reduce((a, b) => a + b, 0),
    ),
  );
};
