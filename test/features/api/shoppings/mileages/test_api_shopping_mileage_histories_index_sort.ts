import { ArrayUtil, GaffComparator, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMileageHistory } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileageHistory";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_admin_login } from "../actors/test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { test_api_shopping_actor_seller_join } from "../actors/test_api_shopping_actor_seller_join";
import { generate_random_mileage_histories } from "./internal/generate_random_mileage_histories";

export const test_api_shopping_mileage_histories_index_sort = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_admin_login(pool);
  await test_api_shopping_actor_seller_join(pool);
  const customer: IShoppingCustomer =
    await test_api_shopping_actor_customer_join(pool);

  await ArrayUtil.asyncRepeat(10, () =>
    generate_random_mileage_histories(pool, customer),
  );

  const validator = TestValidator.sort<
    IShoppingMileageHistory,
    IShoppingMileageHistory.IRequest.SortableColumns,
    IPage.Sort<IShoppingMileageHistory.IRequest.SortableColumns>
  >("sort", async (input) => {
    const page: IPage<IShoppingMileageHistory> =
      await ShoppingApi.functional.shoppings.customers.mileages.histories.index(
        pool.customer,
        {
          limit: 100,
          sort: input,
        },
      );
    return page.data;
  });

  const components = [
    validator("mileage.code")(GaffComparator.strings((x) => x.mileage.code)),
    validator("history.value")(GaffComparator.numbers((x) => x.value)),
    validator("history.created_at")(GaffComparator.dates((x) => x.created_at)),
  ];
  for (const comp of components) {
    await comp("+");
    await comp("-");
  }
};
