import { ArrayUtil } from "@nestia/e2e";
import { Prisma } from "@prisma/client";

import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";

import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingCustomerProvider } from "../actors/ShoppingCustomerProvider";
import { ShoppingOrderGoodProvider } from "./ShoppingOrderGoodProvider";
import { ShoppingOrderPublishProvider } from "./ShoppingOrderPublishProvider";

export namespace ShoppingOrderProvider {
  /* -----------------------------------------------------------
    TRANSFOMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = async (
      input: Prisma.shopping_ordersGetPayload<ReturnType<typeof select>>,
    ): Promise<IShoppingOrder> => {
      if (input.mv_price === null)
        throw ErrorProvider.internal("mv_price is null");
      return {
        id: input.id,
        customer: ShoppingCustomerProvider.json.transform(input.customer),
        goods: await ArrayUtil.asyncMap(input.goods)(
          ShoppingOrderGoodProvider.json.transform,
        ),
        publish:
          input.publish !== null
            ? ShoppingOrderPublishProvider.json.transform(input.publish)
            : null,
        price: {
          nominal: input.mv_price.nominal,
          real: input.mv_price.real,
          cash: input.mv_price.cash,
          deposit: input.mv_price.deposit,
          mileage: input.mv_price.mileage,
          ticket: input.mv_price.ticket,
          ticket_payments: [], // @todo
        },
        created_at: input.created_at.toISOString(),
      };
    };
    export const select = () =>
      ({
        include: {
          customer: ShoppingCustomerProvider.json.select(),
          goods: ShoppingOrderGoodProvider.json.select(),
          publish: ShoppingOrderPublishProvider.json.select(),
          mv_price: true,
        },
      } satisfies Prisma.shopping_ordersFindManyArgs);
  }

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
}
