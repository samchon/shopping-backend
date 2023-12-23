import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";

import { ConnectionPool } from "../../../../ConnectionPool";
import { TestGlobal } from "../../../../TestGlobal";
import { test_api_shopping_actor_customer_create } from "./test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_seller_join } from "./test_api_shopping_actor_seller_join";

export const test_api_shopping_actor_seller_password_change = async (
  pool: ConnectionPool,
): Promise<void> => {
  // JOIN AS A SELLER
  const joined: IShoppingSeller.IInvert =
    await test_api_shopping_actor_seller_join(pool);

  const login = async (password: string) => {
    await test_api_shopping_actor_customer_create(pool, pool.seller);
    const authorized: IShoppingSeller.IInvert =
      await ShoppingApi.functional.shoppings.sellers.authenticate.login(
        pool.seller,
        {
          email: joined.member.emails[0].value,
          password,
        },
      );
    return typia.assertEquals(authorized);
  };

  // LOGIN AGAIN
  const first: IShoppingSeller.IInvert = await login(TestGlobal.PASSWORD);
  validate("login")(joined)(first);

  // CHANGE PASSWORD
  await ShoppingApi.functional.shoppings.customers.authenticate.password.change(
    pool.seller,
    {
      oldbie: TestGlobal.PASSWORD,
      newbie: NEW_PASSWORD,
    },
  );

  // TRY LOGIN WITH PREVIOUS PASSWORD -> FAIL
  await TestValidator.httpError("previous")(403)(() =>
    login(TestGlobal.PASSWORD),
  );

  // TRY LOGIN WITH NEW PASSWORD -> SUCCESS
  const after: IShoppingSeller.IInvert = await login(NEW_PASSWORD);
  validate("after")(joined)(after);

  // ROLLBACK PASSWORD
  await ShoppingApi.functional.shoppings.customers.authenticate.password.change(
    pool.seller,
    {
      oldbie: NEW_PASSWORD,
      newbie: TestGlobal.PASSWORD,
    },
  );
  const again: IShoppingSeller.IInvert = await login(TestGlobal.PASSWORD);
  validate("again")(joined)(again);
};

const validate =
  (title: string) =>
  (x: IShoppingSeller.IInvert) =>
  (y: IShoppingSeller.IInvert) =>
    TestValidator.equals(title)(
      typia.misc.clone<Omit<IShoppingSeller.IInvert, "customer">>(x),
    )(y);

const NEW_PASSWORD = "something";
