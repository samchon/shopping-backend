import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingDepositCharge } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositCharge";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderPrice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPrice";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { generate_random_cart_commodity } from "../../carts/internal/generate_random_cart_commodity";
import { generate_random_order } from "../../orders/internal/generate_random_order";
import { generate_random_sole_sale } from "../../sales/internal/generate_random_sole_sale";
import { generate_random_deposit_charge } from "./generate_random_deposit_charge";
import { generate_random_deposit_charge_publish } from "./generate_random_deposit_charge_publish";

export const generate_random_deposit_histories = async (
  pool: ConnectionPool,
  props: generate_random_deposit_histories.IProps,
): Promise<void> => {
  const charge: IShoppingDepositCharge = await generate_random_deposit_charge(
    pool,
    {
      value: props.charge,
    },
  );
  charge.publish = await generate_random_deposit_charge_publish(
    pool,
    charge,
    true,
  );

  const sale: IShoppingSale = await generate_random_sole_sale(pool, {
    nominal: 10_000,
    real: 10_000,
  });
  const commodity: IShoppingCartCommodity =
    await generate_random_cart_commodity(pool, sale);
  const order: IShoppingOrder = await generate_random_order(pool, [commodity]);
  order.price = typia.assertEquals<IShoppingOrderPrice>(
    await ShoppingApi.functional.shoppings.customers.orders.discount(
      pool.customer,
      order.id,
      {
        deposit: props.discount,
        mileage: 0,
        coupon_ids: [],
      },
    ),
  );
};
export namespace generate_random_deposit_histories {
  export interface IProps {
    charge: number;
    discount: number;
  }
}
