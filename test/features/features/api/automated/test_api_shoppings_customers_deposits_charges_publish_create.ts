import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";
import type { IShoppingDepositChargePublish } from "../../../../../src/api/structures/shoppings/deposits/IShoppingDepositChargePublish";

export const test_api_shoppings_customers_deposits_charges_publish_create =
  async (connection: api.IConnection) => {
    const output: IShoppingDepositChargePublish =
      await api.functional.shoppings.customers.deposits.charges.publish.create(
        connection,
        {
          chargeId: typia.random<string & Format<"uuid">>(),
          body: typia.random<IShoppingDepositChargePublish.ICreate>(),
        },
      );
    typia.assert(output);
  };
