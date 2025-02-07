import { TestValidator } from "@nestia/e2e";
import { v4 } from "uuid";

import ShoppingApi from "@samchon/shopping-api";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMember } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMember";

import { ShoppingGlobal } from "../../../../../src/ShoppingGlobal";
import { ShoppingMemberProvider } from "../../../../../src/providers/shoppings/actors/ShoppingMemberProvider";
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
  const customer: IShoppingCustomer =
    await test_api_shopping_actor_customer_create(pool, pool.admin);
  const admin: IShoppingAdministrator.IInvert = await (async () => {
    const login = (): Promise<IShoppingAdministrator.IInvert> =>
      ShoppingApi.functional.shoppings.admins.authenticate.login(pool.admin, {
        email: input.email,
        password: TestGlobal.PASSWORD,
      });
    try {
      return await login();
    } catch {
      const joined: IShoppingCustomer = await ShoppingMemberProvider.join({
        customer,
        input,
      });
      await ShoppingGlobal.prisma.shopping_administrators.create({
        data: {
          id: v4(),
          member: {
            connect: { id: joined.member!.id },
          },
          created_at: new Date(),
        },
      });
      await ShoppingGlobal.prisma.shopping_sellers.create({
        data: {
          id: v4(),
          member: {
            connect: { id: joined.member!.id },
          },
          created_at: new Date(),
        },
      });
      return await login();
    }
  })();
  TestValidator.equals("passed")(input)({
    email: admin.member.emails[0].value,
    password: TestGlobal.PASSWORD,
    nickname: admin.member.nickname,
    citizen: admin.citizen!,
  });
  return admin;
};
