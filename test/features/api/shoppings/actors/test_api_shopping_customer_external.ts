import { RandomGenerator, TestValidator } from "@nestia/e2e";
import typia from "typia";
import { v4 } from "uuid";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCitizen } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCitizen";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingExternalUser } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingExternalUser";

import { ConnectionPool } from "../../../../ConnectionPool";
import { test_api_shopping_customer_create } from "./test_api_shopping_customer_create";

export const test_api_shopping_customer_external = async (
  pool: ConnectionPool,
): Promise<IShoppingCustomer> => {
  // INITIALIZE CUSTOMER, A GUEST
  const issued: IShoppingCustomer.IAuthorized =
    await test_api_shopping_customer_create(pool);
  validate("issue")(issued)({
    ...issued,
    citizen: null,
    external_user: null,
    member: null,
  });

  // IShoppingCustomer.external_user
  const input = {
    external: typia.assert<IShoppingExternalUser.ICreate>({
      application: "test-application",
      uid: v4(),
      nickname: RandomGenerator.name(8),
      data: null,
      password: v4(),
    }),
    citizen: typia.assert<IShoppingCitizen.ICreate>({
      name: RandomGenerator.name(8),
      mobile: RandomGenerator.mobile(),
    }),
  };
  const external: IShoppingCustomer =
    await ShoppingApi.functional.shoppings.customers.authenticate.external(
      pool.customer,
      input.external,
    );
  typia.assertEquals(external);
  validate("external")(external)({
    ...issued,
    external_user: {
      ...external.external_user!,
      ...input.external,
      citizen: null,
    },
  });

  // IShoppingCustomer.(citizen & external_user)
  const citizen: IShoppingCustomer =
    await ShoppingApi.functional.shoppings.customers.authenticate.activate(
      pool.customer,
      input.citizen,
    );
  typia.assertEquals(citizen);
  validate("citizen")(citizen)({
    ...issued,
    citizen: {
      ...citizen.citizen!,
      ...input.citizen,
    },
    external_user: {
      ...citizen.external_user!,
      ...input.external,
      citizen: citizen.citizen,
    },
  });

  // RE-CREATE CUSTOMER AND EXTERNAL AGAIN
  await test_api_shopping_customer_create(pool);
  await ShoppingApi.functional.shoppings.customers.authenticate.external(
    pool.customer,
    input.external,
  );
  validate("again")(citizen)(
    await ShoppingApi.functional.shoppings.customers.authenticate.refresh(
      pool.customer,
      {
        value: issued.token.refresh,
      },
    ),
  );
  return citizen;
};

const validate =
  (title: string) => (x: IShoppingCustomer) => (y: IShoppingCustomer) =>
    TestValidator.equals(title)(
      typia.misc.clone<Omit<IShoppingCustomer, "created_at">>(x),
    )(y);
