import { RandomGenerator, TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCitizen } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCitizen";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMember } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMember";

import { ConnectionPool } from "../../../../ConnectionPool";
import { TestGlobal } from "../../../../TestGlobal";
import { test_api_shopping_customer_create } from "./test_api_shopping_customer_create";

export const test_api_shopping_customer_join = async (
  pool: ConnectionPool,
  connection?: ShoppingApi.IConnection,
  input?: Partial<IShoppingMember.IJoin>,
): Promise<IShoppingCustomer.IAuthorized> => {
  // A CUSTOMER -> GUEST
  const issued: IShoppingCustomer.IAuthorized =
    await test_api_shopping_customer_create(pool, connection);
  TestValidator.equals("issued.member")(false)(!!issued.member);
  TestValidator.equals("issued.citizen")(false)(!!issued.citizen);

  // DO JOIN
  const emended: IShoppingMember.IJoin = {
    email: `${RandomGenerator.alphaNumeric(16)}@nestia.io`,
    password: TestGlobal.PASSWORD,
    nickname: RandomGenerator.name(),
    citizen: {
      mobile: RandomGenerator.mobile(),
      name: RandomGenerator.name(),
    },
    ...(input ?? {}),
  };
  const [joined, newbie] = await (async () => {
    try {
      const joined: IShoppingCustomer =
        await ShoppingApi.functional.shoppings.customers.authenticate.join(
          connection ?? pool.customer,
          emended,
        );
      return [typia.assertEquals(joined), true];
    } catch (exp) {
      if (input?.email?.length)
        return [
          await ShoppingApi.functional.shoppings.customers.authenticate.login(
            connection ?? pool.customer,
            {
              email: input.email,
              password: TestGlobal.PASSWORD,
            },
          ),
          false,
        ];
      throw exp;
    }
  })();

  // VALIDATE MEBERSHIP INFO
  if (newbie === true) {
    TestValidator.equals("joined.member")({
      emails: [
        {
          value: emended.email,
        },
      ],
      nickname: emended.nickname,
      citizen: emended.citizen as IShoppingCitizen | null,
    })(joined.member!);
    TestValidator.equals("joined.citizen")(emended.citizen)(joined.citizen);
    TestValidator.equals("issued vs joined")(
      typia.misc.clone<Omit<IShoppingCustomer, "created_at">>({
        ...issued,
        member: joined.member,
        citizen: joined.citizen,
      }),
    )(joined);
  }
  return {
    ...joined,
    token: issued.token,
    setHeaders: issued.setHeaders,
  };
};
