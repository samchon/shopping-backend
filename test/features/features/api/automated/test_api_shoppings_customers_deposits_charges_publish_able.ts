import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import api from "../../../../../src/api";

export const test_api_shoppings_customers_deposits_charges_publish_able =
  async (connection: api.IConnection) => {
    const output: false | true =
      await api.functional.shoppings.customers.deposits.charges.publish.able(
        connection,
        {
          chargeId: typia.random<string & Format<"uuid">>(),
        },
      );
    typia.assert(output);
  };
