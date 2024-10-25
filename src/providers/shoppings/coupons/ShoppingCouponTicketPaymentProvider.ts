import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingCouponTicket } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponTicket";
import { IShoppingCouponTicketPayment } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponTicketPayment";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ShoppingCouponTicketProvider } from "./ShoppingCouponTicketProvider";

export namespace ShoppingCouponTicketPaymentProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = async (
      input: Prisma.shopping_coupon_ticket_paymentsGetPayload<
        ReturnType<typeof select>
      >
    ): Promise<IShoppingCouponTicketPayment> => ({
      id: input.id,
      ticket: await ShoppingCouponTicketProvider.json.transform(input.ticket),
      created_at: input.created_at.toISOString(),
    });
    export const select = (actor: IShoppingActorEntity) =>
      ({
        include: {
          ticket: ShoppingCouponTicketProvider.json.select(actor),
        },
      }) satisfies Prisma.shopping_coupon_ticket_paymentsFindManyArgs;
  }

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create = async (props: {
    order: IShoppingOrder;
    ticket: IShoppingCouponTicket;
    sequence: number;
  }): Promise<IShoppingCouponTicketPayment> => {
    const record =
      await ShoppingGlobal.prisma.shopping_coupon_ticket_payments.create({
        data: {
          id: v4(),
          order: {
            connect: { id: props.order.id },
          },
          ticket: {
            connect: { id: props.ticket.id },
          },
          sequence: props.sequence,
          created_at: new Date(props.ticket.created_at),
        },
      });
    return {
      id: record.id,
      ticket: props.ticket,
      created_at: record.created_at.toISOString(),
    };
  };
}
