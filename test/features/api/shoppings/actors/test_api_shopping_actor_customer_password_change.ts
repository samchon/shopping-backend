import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";

import { ConnectionPool } from "../../../../ConnectionPool";
import { TestGlobal } from "../../../../TestGlobal";
import { test_api_shopping_actor_customer_create } from "./test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_customer_join } from "./test_api_shopping_actor_customer_join";

export const test_api_shopping_actor_customer_password_change = async (
  pool: ConnectionPool,
): Promise<void> => {
  // MEMBERSHIP JOINING
  const joined: IShoppingCustomer = await test_api_shopping_actor_customer_join(pool);
  const login = async (password: string) => {
    await test_api_shopping_actor_customer_create(pool);
    const authorized: IShoppingCustomer =
      await ShoppingApi.functional.shoppings.customers.authenticate.login(
        pool.customer,
        {
          email: joined.member!.emails[0].value,
          password,
        },
      );
    return typia.assertEquals(authorized);
  };

  // LOGIN AGAIN
  const first: IShoppingCustomer = await login(TestGlobal.PASSWORD);
  validate("login")(joined)(first);

  // CHANGE PASSWORD
  await ShoppingApi.functional.shoppings.customers.authenticate.password.change(
    pool.customer,
    {
      oldbie: TestGlobal.PASSWORD,
      newbie: NEW_PASSWORD,
    },
  );

  // TRY WITH PREVIOUS PASSWORD
  await TestValidator.httpError("previous")(403)(() =>
    login(TestGlobal.PASSWORD),
  );

  // TRY WITH NEW PASSWORD
  const after: IShoppingCustomer = await login(NEW_PASSWORD);
  validate("after")(joined)(after);

  // ROLLBACK TO THE PREVIOUS PASSWORD
  await ShoppingApi.functional.shoppings.customers.authenticate.password.change(
    pool.customer,
    {
      oldbie: NEW_PASSWORD,
      newbie: TestGlobal.PASSWORD,
    },
  );
  const again: IShoppingCustomer = await login(TestGlobal.PASSWORD);
  validate("again")(joined)(again);
};

const validate =
  (title: string) => (x: IShoppingCustomer) => (y: IShoppingCustomer) =>
    TestValidator.equals(title)(
      typia.misc.clone<Omit<IShoppingCustomer, "id" | "created_at">>(x),
    )(y);

const NEW_PASSWORD = "something";
