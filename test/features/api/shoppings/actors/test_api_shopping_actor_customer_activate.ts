import { RandomGenerator, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCitizen } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCitizen";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_actor_customer_create } from "./test_api_shopping_actor_customer_create";

export const test_api_shopping_actor_customer_activate = async (
  pool: ConnectionPool,
): Promise<IShoppingCustomer> => {
  // STARTS WITH A GUEST
  const issued: IShoppingCustomer.IAuthorized =
    await test_api_shopping_actor_customer_create(pool);
  TestValidator.equals("issued.citizen", false, !!issued.citizen);

  // ACTIVATE CITIZEN
  const input: IShoppingCitizen.ICreate = {
    name: RandomGenerator.name(8),
    mobile: RandomGenerator.mobile(),
  };

  // RELOAD & VALIDATE
  const activated: IShoppingCustomer =
    await ShoppingApi.functional.shoppings.customers.authenticate.activate(
      pool.customer,
      input,
    );
  TestValidator.equals("activate.citizen", input, activated.citizen!);
  return activated;
};
