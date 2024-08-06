import { RandomGenerator, TestValidator } from "@nestia/e2e";

import ShoppingApi from "@samchon/shopping-api";
import { IShoppingMember } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMember";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";

import { ConnectionPool } from "../../../../ConnectionPool";
import { TestGlobal } from "../../../../TestGlobal";
import { test_api_shopping_actor_customer_create } from "./test_api_shopping_actor_customer_create";

export const test_api_shopping_actor_seller_join = async (
  pool: ConnectionPool,
  email?: string
): Promise<IShoppingSeller.IInvert> => {
  // STARTS FROM THE CUSTOMER (GUEST)
  await test_api_shopping_actor_customer_create(pool, pool.seller);

  // MEMBERSHIP JOINING
  const input: IShoppingMember.IJoin = {
    email: email ?? `${RandomGenerator.alphaNumeric(16)}@nestia.io`,
    password: TestGlobal.PASSWORD,
    nickname: RandomGenerator.name(),
    citizen: {
      mobile: RandomGenerator.mobile(),
      name: RandomGenerator.name(),
    },
  };
  try {
    await ShoppingApi.functional.shoppings.customers.authenticate.join(
      pool.seller,
      input
    );
  } catch {
    return ShoppingApi.functional.shoppings.sellers.authenticate.login(
      pool.seller,
      {
        email: input.email,
        password: TestGlobal.PASSWORD,
      }
    );
  }

  // JOIN AS A SELLER
  const joined: IShoppingSeller.IInvert =
    await ShoppingApi.functional.shoppings.sellers.authenticate.join(
      pool.seller,
      {}
    );

  // DO VALIDATE
  TestValidator.equals("joined.member")({
    emails: [
      {
        value: input.email,
      },
    ],
    nickname: input.nickname,
  })(joined.member);
  TestValidator.equals("joined.citizen")(input.citizen)(joined.citizen);

  return joined;
};
