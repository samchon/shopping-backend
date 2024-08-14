import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";

import { ConnectionPool } from "../../../../../ConnectionPool";

export const generate_random_order = async (
  pool: ConnectionPool,
  commodities: IShoppingCartCommodity[],
  volume?: (commodity: IShoppingCartCommodity) => number,
): Promise<IShoppingOrder> => {
  const order: IShoppingOrder =
    await ShoppingApi.functional.shoppings.customers.orders.create(
      pool.customer,
      {
        goods: commodities.map((commodity) => ({
          commodity_id: commodity.id,
          volume: (volume ?? ((commodity) => commodity.volume))(commodity),
        })),
      },
    );
  return order;
};
