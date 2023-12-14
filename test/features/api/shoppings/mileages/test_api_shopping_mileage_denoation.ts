import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMileageDonation } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileageDonation";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_admin_login } from "../actors/test_api_shopping_admin_login";
import { test_api_shopping_customer_join } from "../actors/test_api_shopping_customer_join";
import { generate_random_mileage_donation } from "./internal/generate_random_mileage_donation";

export const test_api_shopping_mileage_donation = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_admin_login(pool);
  const customer: IShoppingCustomer = await test_api_shopping_customer_join(
    pool,
  );
  const donation: IShoppingMileageDonation =
    await generate_random_mileage_donation(pool, customer.citizen!, {
      value: 10_000,
    });
  TestValidator.equals("value")(donation.value)(VALUE);

  const balance: number =
    await ShoppingApi.functional.shoppings.customers.mileages.histories.balance(
      pool.customer,
    );
  TestValidator.equals("balance")(balance)(VALUE);
};

const VALUE = 10_000;
