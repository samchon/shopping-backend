import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";

import { ConnectionPool } from "../../../../ConnectionPool";
import { TestGlobal } from "../../../../TestGlobal";

export const test_api_shopping_actor_customer_create = async (
  pool: ConnectionPool,
  connection?: ShoppingApi.IConnection,
): Promise<IShoppingCustomer.IAuthorized> => {
  const customer: IShoppingCustomer.IAuthorized =
    await ShoppingApi.functional.shoppings.customers.authenticate.create(
      connection ?? pool.customer,
      {
        href: TestGlobal.HREF,
        referrer: TestGlobal.REFERRER,
        channel_code: TestGlobal.CHANNEL,
        external_user: null,
      },
    );
  TestValidator.equals("citizen")(customer.citizen)(null);
  TestValidator.equals("external_user")(customer.external_user)(null);
  TestValidator.equals("member")(customer.member)(null);
  return typia.assertEquals(customer);
};
