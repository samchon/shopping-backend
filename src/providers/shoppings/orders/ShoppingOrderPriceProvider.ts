import { ArrayUtil } from "@nestia/e2e";
import { Prisma } from "@prisma/client";

import { ShoppingCouponTicketDiagnoser } from "@samchon/shopping-api/lib/diagnosers/shoppings/coupons/ShoppingCouponTicketDiagnoser";
import { ShoppingOrderDiscountableDiagnoser } from "@samchon/shopping-api/lib/diagnosers/shoppings/orders/ShoppingOrderDiscountableDiagnoser";
import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";
import { IShoppingCouponTicket } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponTicket";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderDiscountable";
import { IShoppingOrderGood } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderGood";
import { IShoppingOrderPrice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPrice";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingCouponProvider } from "../coupons/ShoppingCouponProvider";
import { ShoppingCouponTicketPaymentProvider } from "../coupons/ShoppingCouponTicketPaymentProvider";
import { ShoppingCouponTicketProvider } from "../coupons/ShoppingCouponTicketProvider";
import { ShoppingDepositHistoryProvider } from "../deposits/ShoppingDepositHistoryProvider";
import { ShoppingMileageHistoryProvider } from "../mileages/ShoppingMileageHistoryProvider";
import { ShoppingOrderProvider } from "./ShoppingOrderProvider";

export namespace ShoppingOrderPriceProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = async (
      input: Prisma.shopping_ordersGetPayload<ReturnType<typeof select>>
    ): Promise<IShoppingOrderPrice> => {
      if (input.mv_price === null)
        throw ErrorProvider.internal("mv_price is null");
      return {
        nominal: input.mv_price.nominal,
        real: input.mv_price.real,
        cash: input.cash,
        deposit: input.deposit,
        mileage: input.mileage,
        ticket: input.mv_price.ticket,
        ticket_payments: await ArrayUtil.asyncMap(input.ticket_payments)(
          ShoppingCouponTicketPaymentProvider.json.transform
        ),
      };
    };
    export const select = (actor: IShoppingActorEntity) => ({
      include: {
        mv_price: true,
        ticket_payments: ShoppingCouponTicketPaymentProvider.json.select(actor),
      },
    });
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const at = async (props: {
    customer: IShoppingCustomer;
    order: IEntity;
  }): Promise<IShoppingOrderPrice> => {
    const record = await ShoppingGlobal.prisma.shopping_orders.findFirstOrThrow(
      {
        where: {
          id: props.order.id,
          ...ShoppingOrderProvider.where(props.customer),
        },
        ...json.select(props.customer),
      }
    );
    return json.transform(record);
  };

  export const discountable = async (props: {
    customer: IShoppingCustomer;
    order: IEntity;
    input: IShoppingOrderDiscountable.IRequest;
  }): Promise<IShoppingOrderDiscountable> => {
    const reference: IShoppingOrder = await ShoppingOrderProvider.at({
      actor: props.customer,
      id: props.order.id,
    });
    if (reference.publish !== null)
      throw ErrorProvider.gone({
        accessor: "id",
        message: "Order has been already published.",
      });
    const price: IShoppingOrderPrice =
      await ShoppingOrderPriceProvider.at(props);
    const goods: IShoppingOrderGood[] =
      props.input.good_ids === null
        ? reference.goods
        : reference.goods.filter((good) =>
            props.input.good_ids!.some((id) => id === good.id)
          );
    if (
      props.input.good_ids !== null &&
      props.input.good_ids.length !== goods.length
    )
      throw ErrorProvider.notFound({
        accessor: "input.good_ids",
        message: "Some goods are not found.",
      });
    return {
      mileage: props.customer.citizen
        ? (await ShoppingMileageHistoryProvider.getBalance(
            props.customer.citizen
          )) + price.mileage
        : 0,
      deposit: props.customer.citizen
        ? (await ShoppingDepositHistoryProvider.getBalance(
            props.customer.citizen
          )) + price.deposit
        : 0,
      combinations: ShoppingOrderDiscountableDiagnoser.combinate(
        props.customer
      )(
        await take((input) =>
          ShoppingCouponProvider.index({
            actor: props.customer,
            input,
          })
        ),
        props.customer.citizen
          ? [
              ...(await take((input) =>
                ShoppingCouponTicketProvider.index({
                  customer: props.customer,
                  input,
                })
              )),
              ...price.ticket_payments.map((tp) => tp.ticket),
            ]
          : []
      )(goods),
    };
  };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const discount = async (props: {
    customer: IShoppingCustomer;
    order: IEntity;
    input: IShoppingOrderPrice.ICreate;
  }): Promise<IShoppingOrderPrice> => {
    const { order: reference, combination } = await prepare(props);

    // HISTORIES OF DEPOSIT AND MILEAGE
    if (props.customer.citizen) {
      await ShoppingDepositHistoryProvider.emplace({
        citizen: props.customer.citizen,
        deposit: {
          code: "shopping_order_payment",
        },
        source: reference,
        value: props.input.deposit,
      });
      await ShoppingMileageHistoryProvider.emplace({
        citizen: props.customer.citizen,
        mileage: {
          code: "shopping_order_payment",
        },
        source: reference,
        value: () => props.input.mileage,
      });
    }

    // DISTRIBUTE DISCOUNTS TO EACH ORDER ITEMS
    for (const good of reference.goods) {
      const ratio = good.price.real / reference.price.real;
      const share = {
        deposit: props.input.deposit * ratio,
        mileage: props.input.mileage * ratio,
        ticket: (combination?.amount ?? 0) * ratio,
      };
      await ShoppingGlobal.prisma.mv_shopping_order_good_prices.update({
        where: {
          shopping_order_good_id: good.id,
        },
        data: {
          cash: good.price.real - share.deposit - share.mileage - share.ticket,
          deposit: share.deposit,
          mileage: share.mileage,
          ticket: share.ticket,
        },
      });
    }

    // FINALIZE
    await ShoppingGlobal.prisma.mv_shopping_order_prices.update({
      where: {
        shopping_order_id: props.order.id,
      },
      data: {
        ticket: combination?.amount ?? 0,
      },
    });
    const reloaded = await ShoppingGlobal.prisma.shopping_orders.update({
      where: {
        id: props.order.id,
      },
      data: {
        cash:
          reference.price.real -
          props.input.deposit -
          props.input.mileage -
          (combination?.amount ?? 0),
        deposit: props.input.deposit,
        mileage: props.input.mileage,
      },
      ...json.select(props.customer),
    });
    return json.transform(reloaded);
  };

  const prepare = async (props: {
    customer: IShoppingCustomer;
    order: IEntity;
    input: IShoppingOrderPrice.ICreate;
  }): Promise<IAsset> => {
    // FIND ORDER
    const order: IShoppingOrder = await ShoppingOrderProvider.at({
      actor: props.customer,
      id: props.order.id,
    });
    if (order.publish !== null)
      throw ErrorProvider.gone({
        accessor: "id",
        message: "Order has been already published.",
      });

    // VALIDATE BALANCES
    const deposit: number =
      props.customer.citizen !== null
        ? (await ShoppingDepositHistoryProvider.getBalance(
            props.customer.citizen
          )) + order.price.deposit
        : 0;
    const mileage: number =
      props.customer.citizen !== null
        ? (await ShoppingMileageHistoryProvider.getBalance(
            props.customer.citizen
          )) + order.price.mileage
        : 0;
    if (deposit < props.input.deposit)
      throw ErrorProvider.unprocessable({
        accessor: "input.deposit",
        message: "Not enough deposit.",
      });
    if (mileage < props.input.mileage)
      throw ErrorProvider.unprocessable({
        accessor: "input.mileage",
        message: "Not enough mileage.",
      });

    // REMOVE PREVIOUS TICKET PAYMENTS
    await ShoppingGlobal.prisma.shopping_coupon_ticket_payments.deleteMany({
      where: {
        shopping_order_id: order.id,
      },
    });
    if (props.input.coupon_ids.length === 0)
      return {
        order,
        combination: null,
      };

    // GET TICKETS AND COUPONS
    const tickets: IShoppingCouponTicket[] =
      ShoppingCouponTicketDiagnoser.unique(
        await ArrayUtil.asyncMap(
          await ShoppingGlobal.prisma.shopping_coupon_tickets.findMany({
            where: {
              AND: [
                {
                  shopping_coupon_id: {
                    in: props.input.coupon_ids,
                  },
                },
                ...ShoppingCouponTicketProvider.where(props.customer).AND,
              ],
            },
            ...ShoppingCouponTicketProvider.json.select(props.customer),
          })
        )(ShoppingCouponTicketProvider.json.transform)
      );
    const coupons: IShoppingCoupon[] =
      tickets.length === props.input.coupon_ids.length
        ? []
        : await ArrayUtil.asyncMap(
            await ShoppingGlobal.prisma.shopping_coupons.findMany({
              where: {
                AND: [
                  {
                    id: {
                      in: props.input.coupon_ids,
                    },
                  },
                  ...ShoppingCouponProvider.wherePossible().AND,
                ],
              },
              ...ShoppingCouponProvider.json.select(props.customer),
            })
          )(ShoppingCouponProvider.json.transform);
    if (tickets.length + coupons.length !== props.input.coupon_ids.length)
      throw ErrorProvider.notFound({
        accessor: "input.coupon_ids",
        message: "Some coupons are not found.",
      });

    // VALIDATE APPLICABILITY
    const entire: IShoppingCoupon[] = [
      ...tickets.map((t) => t.coupon),
      ...coupons,
    ];
    const adjustable: boolean =
      (entire.every(
        ShoppingOrderDiscountableDiagnoser.checkCoupon(props.customer)(
          order.goods
        )
      ) &&
        entire.length === 1) ||
      entire.every((c) => false === c.restriction.exclusive);
    if (false === adjustable)
      throw ErrorProvider.unprocessable({
        accessor: "input.coupon_ids",
        message: "Some coupons are not applicable.",
      });

    // ISSUE TICKETS IF REQUIRED
    if (coupons.length)
      tickets.push(
        ...(await ArrayUtil.asyncMap(coupons)((c) =>
          ShoppingCouponTicketProvider.create({
            customer: props.customer,
            input: {
              coupon_id: c.id,
            },
          })
        ))
      );

    // DO TICKET PAYMENTS
    await ArrayUtil.asyncMap(tickets)((t, i) =>
      ShoppingCouponTicketPaymentProvider.create({
        order,
        ticket: t,
        sequence: i,
      })
    );

    // RETURNS
    const [combination] = ShoppingOrderDiscountableDiagnoser.combinate(
      props.customer
    )(
      [],
      tickets
    )(order.goods);
    return {
      order,
      combination,
    };
  };
}

interface IAsset {
  order: IShoppingOrder;
  combination: IShoppingOrderDiscountable.ICombination | null;
}

const take = async <T extends object>(
  closure: (input: IPage.IRequest) => Promise<IPage<T>>
): Promise<T[]> => {
  const page = await closure({ limit: 0 });
  return page.data;
};
