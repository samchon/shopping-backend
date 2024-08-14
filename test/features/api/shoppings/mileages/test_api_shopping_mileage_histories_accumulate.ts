import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMileage } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileage";
import { IShoppingMileageHistory } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileageHistory";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_mileage_histories } from "./internal/generate_random_mileage_histories";

export const test_api_shopping_mileage_histories_accumulate = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_seller_join(pool);
  const customer: IShoppingCustomer =
    await test_api_shopping_actor_customer_join(pool);
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

  const getDefaultValue = async (code: string): Promise<number> => {
    const mileage: IShoppingMileage =
      await ShoppingApi.functional.shoppings.admins.mileages.get(
        pool.admin,
        code,
      );
    return typia.assert<number>(mileage.value);
  };

  TestValidator.equals("histories[].value")(
    histories.data.map((history) => history.value * history.mileage.direction),
  )([
    donation.value,
    -donation.value,
    good.price.real *
      (await getDefaultValue("shopping_order_good_confirm_reward")),
    await getDefaultValue("shopping_sale_snapshot_review_photo_reward"),
  ]);

  TestValidator.equals("histories[].balance")(
    histories.data.map((history) => history.balance),
  )(
    histories.data.map(
      (history, i) =>
        history.value * history.mileage.direction +
        histories.data
          .slice(0, i)
          .map((history) => history.value * history.mileage.direction)
          .reduce((a, b) => a + b, 0),
    ),
  );
};
