import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";

import { ConnectionPool } from "../../../../ConnectionPool";
import { TestGlobal } from "../../../../TestGlobal";
import { test_api_shopping_actor_customer_create } from "./test_api_shopping_actor_customer_create";
import { test_api_shopping_actor_seller_join } from "./test_api_shopping_actor_seller_join";

export const test_api_shopping_actor_seller_login = async (
  pool: ConnectionPool
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
        }
      );
    return authorized;
  };

  // LOGIN AGAIN
  const passed: IShoppingSeller.IInvert = await login(TestGlobal.PASSWORD);
  TestValidator.equals("passed")(
    typia.misc.clone<Omit<IShoppingSeller.IInvert, "customer">>(joined)
  )(passed);

  // TRY AGAIN WITH WRONG PASSWORD
  await TestValidator.httpError("wrong password")(403)(() =>
    login(FAILED_PASSWORD)
  );
};

const FAILED_PASSWORD = "wrong password";
