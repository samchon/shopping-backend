import { Prisma } from "@prisma/client";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingOrderPrice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPrice";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingOrderProvider } from "./ShoppingOrderProvider";

export namespace ShoppingOrderPriceProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_ordersGetPayload<ReturnType<typeof select>>,
    ): IShoppingOrderPrice => {
      if (input.mv_price === null)
        throw ErrorProvider.internal("mv_price is null");
      return {
        nominal: input.mv_price.nominal,
        real: input.mv_price.real,
        cash: input.cash,
        deposit: input.deposit,
        mileage: input.mileage,
        ticket: input.mv_price.ticket,
        ticket_payments: [], // @todo
      };
    };
    export const select = () => ({
      include: {
        mv_price: true,
        ticket_payments: true,
      },
    });
  }

  export const at =
    (customer: IShoppingCustomer) =>
    async (order: IEntity): Promise<IShoppingOrderPrice> => {
      const record =
        await ShoppingGlobal.prisma.shopping_orders.findFirstOrThrow({
          where: {
            id: order.id,
            ...ShoppingOrderProvider.where(customer),
          },
          ...json.select(),
        });
      return json.transform(record);
    };
}
