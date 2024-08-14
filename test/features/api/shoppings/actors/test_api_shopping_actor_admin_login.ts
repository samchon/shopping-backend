import { TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingMember } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMember";

import { ConnectionPool } from "../../../../ConnectionPool";
import { TestGlobal } from "../../../../TestGlobal";
import { test_api_shopping_actor_customer_create } from "./test_api_shopping_actor_customer_create";

export const test_api_shopping_actor_admin_login = async (
  pool: ConnectionPool,
): Promise<IShoppingAdministrator.IInvert> => {
  const input: IShoppingMember.IJoin = {
    email: "robot@nestia.io",
    password: TestGlobal.PASSWORD,
    nickname: "Robot",
    citizen: {
      mobile: "01012345678",
      name: "Robot",
    },
  };

  await test_api_shopping_actor_customer_create(pool, pool.admin);
  const passed: IShoppingAdministrator.IInvert =
    await ShoppingApi.functional.shoppings.admins.authenticate.login(
      pool.admin,
      {
        email: input.email,
        password: TestGlobal.PASSWORD,
      },
    );
  TestValidator.equals("passed")(input)({
    email: passed.member.emails[0].value,
    password: TestGlobal.PASSWORD,
    nickname: passed.member.nickname,
    citizen: passed.citizen!,
  });
  return passed;
};
