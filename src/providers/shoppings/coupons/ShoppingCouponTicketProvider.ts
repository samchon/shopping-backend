import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingCitizen } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCitizen";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingCouponTicket } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponTicket";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { PaginationUtil } from "../../../utils/PaginationUtil";
import { ShoppingCustomerProvider } from "../actors/ShoppingCustomerProvider";
import { ShoppingCouponProvider } from "./ShoppingCouponProvider";

export namespace ShoppingCouponTicketProvider {
  /* -----------------------------------------------------------
      TRANSFORMERS
    ----------------------------------------------------------- */
  export namespace json {
    export const transform = async (
      input: Prisma.shopping_coupon_ticketsGetPayload<ReturnType<typeof select>>
    ): Promise<IShoppingCouponTicket> => ({
      id: input.id,
      customer: ShoppingCustomerProvider.json.transform(input.customer),
      coupon: await ShoppingCouponProvider.json.transform(input.coupon),
      created_at: input.created_at.toISOString(),
      expired_at: input.expired_at?.toISOString() ?? null,
    });
    export const select = (actor: IShoppingActorEntity) =>
      ({
        include: {
          customer: ShoppingCustomerProvider.json.select(),
          coupon: ShoppingCouponProvider.json.select(actor),
        },
      }) satisfies Prisma.shopping_coupon_ticketsFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index = async (props: {
    customer: IShoppingCustomer;
    input: IShoppingCouponTicket.IRequest;
  }): Promise<IPage<IShoppingCouponTicket>> => {
    authorize(props.customer);
    return PaginationUtil.paginate({
      schema: ShoppingGlobal.prisma.shopping_coupon_tickets,
      payload: json.select(props.customer),
      transform: json.transform,
    })({
      where: {
        AND: [
          { customer: ShoppingCustomerProvider.where(props.customer) },
          { payment: null },
          {
            OR: [{ expired_at: null }, { expired_at: { gt: new Date() } }],
          },
        ],
      },
      orderBy: [{ created_at: "asc" }],
    } satisfies Prisma.shopping_coupon_ticketsFindManyArgs)(props.input);
  };

  export const where = (customer: IShoppingCustomer) => {
    authorize(customer);
    return {
      AND: [
        { customer: ShoppingCustomerProvider.where(customer) },
        { payment: null },
        {
          OR: [{ expired_at: null }, { expired_at: { gt: new Date() } }],
        },
      ],
    } satisfies Prisma.shopping_coupon_ticketsWhereInput;
  };

  export const at = async (props: {
    customer: IShoppingCustomer;
    id: string;
  }): Promise<IShoppingCouponTicket> => {
    authorize(props.customer);
    const record =
      await ShoppingGlobal.prisma.shopping_coupon_tickets.findFirstOrThrow({
        where: {
          id: props.id,
          customer: ShoppingCustomerProvider.where(props.customer),
        },
        ...json.select(props.customer),
      });
    const payment =
      await ShoppingGlobal.prisma.shopping_coupon_ticket_payments.findFirst({
        where: {
          shopping_coupon_ticket_id: record.id,
        },
      });

    if (payment !== null)
      throw ErrorProvider.gone({
        accessor: "id",
        message: "Coupon ticket has been paid.",
      });
    if (record.expired_at !== null && record.expired_at < new Date())
      throw ErrorProvider.gone({
        accessor: "id",
        message: "Coupon ticket has been expired.",
      });
    return json.transform(record);
  };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create = async (props: {
    customer: IShoppingCustomer;
    input: IShoppingCouponTicket.ICreate;
  }): Promise<IShoppingCouponTicket> => {
    const coupon: IShoppingCoupon = await ShoppingCouponProvider.at({
      actor: props.customer,
      id: props.input.coupon_id,
    });
    if (coupon.inventory.volume !== null && coupon.inventory.volume < 1)
      throw ErrorProvider.gone({
        accessor: "input.coupon_id",
        message: "The quantity of the coupon has run out.",
      });
    else if (
      coupon.inventory.volume_per_citizen !== null &&
      coupon.inventory.volume_per_citizen < 1
    )
      throw ErrorProvider.gone({
        accessor: "input.coupon_id",
        message: "The number of coupons issued per citizen has been exceeded.",
      });
    else if (
      coupon.restriction.expired_at !== null &&
      new Date(coupon.restriction.expired_at) < new Date()
    )
      throw ErrorProvider.gone({
        accessor: "input.coupon_id",
        message: "Coupon has been expired.",
      });

    const record = await ShoppingGlobal.prisma.shopping_coupon_tickets.create({
      data: {
        id: v4(),
        shopping_customer_id: props.customer.id,
        shopping_coupon_id: coupon.id,
        shopping_coupon_disposable_id: null,
        created_at: new Date(),
        expired_at:
          coupon.restriction.expired_at !== null &&
          coupon.restriction.expired_in !== null
            ? new Date(
                Math.min(
                  new Date(coupon.restriction.expired_at).getTime(),
                  Date.now() +
                    coupon.restriction.expired_in * 24 * 60 * 60 * 1000
                )
              )
            : coupon.restriction.expired_at !== null
              ? new Date(coupon.restriction.expired_at)
              : coupon.restriction.expired_in !== null
                ? new Date(
                    Date.now() +
                      coupon.restriction.expired_in * 24 * 60 * 60 * 1000
                  )
                : null,
      },
      ...json.select(props.customer),
    });

    // DECRESE INVENTORY
    if (coupon.inventory.volume !== null)
      await ShoppingGlobal.prisma.mv_shopping_coupon_inventories.update({
        where: {
          shopping_coupon_id: coupon.id,
        },
        data: {
          value: {
            decrement: 1,
          },
        },
      });
    if (coupon.inventory.volume_per_citizen !== null)
      await ShoppingGlobal.prisma.mv_shopping_coupon_citizen_inventories.upsert(
        {
          where: {
            shopping_coupon_id_shopping_citizen_id: {
              shopping_citizen_id: props.customer.citizen!.id,
              shopping_coupon_id: coupon.id,
            },
          },
          create: {
            id: v4(),
            shopping_coupon_id: coupon.id,
            shopping_citizen_id: props.customer.citizen!.id,
            value: coupon.inventory.volume_per_citizen - 1,
          },
          update: {
            value: {
              decrement: 1,
            },
          },
        }
      );
    return json.transform(record);
  };

  const authorize = (customer: IShoppingCustomer): IShoppingCitizen => {
    if (customer.citizen === null)
      throw ErrorProvider.forbidden({
        accessor: "headers.Authorization",
        message: "Only citizen can use coupon ticket.",
      });
    return customer.citizen;
  };
}
