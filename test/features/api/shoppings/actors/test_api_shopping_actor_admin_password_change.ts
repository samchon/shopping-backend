import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";

import { ConnectionPool } from "../../../../ConnectionPool";
import { TestGlobal } from "../../../../TestGlobal";
import { test_api_shopping_actor_admin_login } from "./test_api_shopping_actor_admin_login";
import { test_api_shopping_actor_customer_create } from "./test_api_shopping_actor_customer_create";

export const test_api_shopping_actor_admin_password_change = async (
  pool: ConnectionPool,
): Promise<void> => {
  const admin: IShoppingAdministrator.IInvert =
    await test_api_shopping_actor_admin_login(pool);
  const login = async (password: string) => {
    await test_api_shopping_actor_customer_create(pool, pool.admin);
    const authorized: IShoppingAdministrator.IInvert =
      await ShoppingApi.functional.shoppings.admins.authenticate.login(
        pool.admin,
        {
          email: admin.member.emails[0].value,
          password,
        },
      );
    return authorized;
  };

  const passed = await login(TestGlobal.PASSWORD);
  const first: IShoppingAdministrator.IInvert = await login(
    TestGlobal.PASSWORD,
  );
  validate("login", passed, first);

  await ShoppingApi.functional.shoppings.customers.authenticate.password.change(
    pool.admin,
    {
      oldbie: TestGlobal.PASSWORD,
      newbie: NEW_PASSWORD,
    },
  );
  const after: IShoppingAdministrator.IInvert = await login(NEW_PASSWORD);
  validate("after", passed, after);

  await ShoppingApi.functional.shoppings.customers.authenticate.password.change(
    pool.admin,
    {
      oldbie: NEW_PASSWORD,
      newbie: TestGlobal.PASSWORD,
    },
  );
  const again: IShoppingAdministrator.IInvert = await login(
    TestGlobal.PASSWORD,
  );
  validate("again", passed, again);
};

const validate = (
  title: string,
  x: IShoppingAdministrator.IInvert,
  y: IShoppingAdministrator.IInvert,
) =>
  TestValidator.equals(
    title,
    typia.misc.clone<Omit<IShoppingAdministrator, "customer">>(x),
    y,
  );

const NEW_PASSWORD = "something";
