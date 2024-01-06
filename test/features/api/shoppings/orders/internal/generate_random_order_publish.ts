import { TestValidator } from "@nestia/e2e";
import typia from "typia";
import { v4 } from "uuid";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingAddress } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAddress";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderPrice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPrice";
import { IShoppingOrderPublish } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPublish";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { prepare_random_address } from "./prepare_random_address";

export const generate_random_order_publish = async (
  pool: ConnectionPool,
  customer: IShoppingCustomer,
  order: IShoppingOrder,
  paid: boolean,
  address?: IShoppingAddress.ICreate,
): Promise<IShoppingOrderPublish> => {
  const price: IShoppingOrderPrice =
    await ShoppingApi.functional.shoppings.customers.orders.price(
      pool.customer,
      order.id,
    );
  typia.assertEquals(price);

  address ??= prepare_random_address(customer.citizen!, address);

  const input: IShoppingOrderPublish.ICreate =
    price.cash === 0
      ? {
          type: "zero",
          address,
        }
      : paid
      ? {
          // @todo - interact with payment system
          type: "cash",
          vendor: "somewhere",
          uid: v4(),
          address,
        }
      : {
          // @todo - interact with payment system
          type: "cash",
          vendor: "somewhere",
          uid: `vbank::${v4()}`,
          address,
        };

  const publish: IShoppingOrderPublish =
    await ShoppingApi.functional.shoppings.customers.orders.publish.create(
      pool.customer,
      order.id,
      input,
    );
  typia.assertEquals(publish);
  TestValidator.equals("paid_at")(!!publish.paid_at)(paid);
  return publish;
};
