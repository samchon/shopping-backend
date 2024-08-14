import { v4 } from "uuid";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingDepositCharge } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositCharge";
import { IShoppingDepositChargePublish } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositChargePublish";

import { ConnectionPool } from "../../../../../ConnectionPool";

export const generate_random_deposit_charge_publish = async (
  pool: ConnectionPool,
  charge: IShoppingDepositCharge,
  paid: boolean,
): Promise<IShoppingDepositChargePublish> => {
  const publish: IShoppingDepositChargePublish =
    await ShoppingApi.functional.shoppings.customers.deposits.charges.publish.create(
      pool.customer,
      charge.id,
      paid
        ? {
            // @todo - interact with payment system
            vendor: "somewhere",
            uid: v4(),
          }
        : {
            // @todo - interact with payment system
            vendor: "somewhere",
            uid: v4(),
          },
    );
  return publish;
};
