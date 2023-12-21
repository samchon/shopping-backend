import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingDepositCharge } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositCharge";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_join } from "../actors/test_api_shopping_actor_customer_join";
import { generate_random_deposit_charge } from "./internal/generate_random_deposit_charge";

export const test_api_shopping_deposit_charge_create = async (
  pool: ConnectionPool,
): Promise<void> => {
  await test_api_shopping_actor_customer_join(pool);

  const value: number = 50_000;
  const charge: IShoppingDepositCharge = await generate_random_deposit_charge(
    pool,
    {
      value,
    },
  );
  TestValidator.equals("value")(charge.value)(value);

  const balance: number =
    await ShoppingApi.functional.shoppings.customers.deposits.histories.balance(
      pool.customer,
    );
  TestValidator.equals("balance")(balance)(0);
};
