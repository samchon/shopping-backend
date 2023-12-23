import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";

import { ConnectionPool } from "../../../../ConnectionPool";
import { TestGlobal } from "../../../../TestGlobal";
import { test_api_shopping_actor_customer_create } from "./test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_customer_join } from "./test_api_shopping_actor_customer_join";

export const test_api_shopping_actor_customer_login = async (
  pool: ConnectionPool,
): Promise<void> => {
  const joined: IShoppingCustomer = await test_api_shopping_actor_customer_join(
    pool,
  );
  const guest: IShoppingCustomer.IAuthorized =
    await test_api_shopping_actor_customer_create(pool);
  TestValidator.equals("guest.member")(guest.member)(null);

  const passed: IShoppingCustomer =
    await ShoppingApi.functional.shoppings.customers.authenticate.login(
      pool.customer,
      {
        email: joined.member!.emails[0].value,
        password: TestGlobal.PASSWORD,
      },
    );
  typia.assertEquals(passed);
  TestValidator.equals("passed")(
    typia.misc.clone<Omit<IShoppingCustomer, "id" | "created_at">>(joined),
  )(passed);
};
