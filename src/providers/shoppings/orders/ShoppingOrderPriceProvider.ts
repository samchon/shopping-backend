import { ArrayUtil } from "@nestia/e2e";
import { Prisma } from "@prisma/client";

import { ShoppingCouponTicketDiagnoser } from "@samchon/shopping-api/lib/diagnosers/shoppings/coupons/HubCouponTicketDiagnoser";
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
      input: Prisma.shopping_ordersGetPayload<ReturnType<typeof select>>,
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
          ShoppingCouponTicketPaymentProvider.json.transform,
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
  export const at =
    (customer: IShoppingCustomer) =>
    async (order: IEntity): Promise<IShoppingOrderPrice> => {
      const record =
        await ShoppingGlobal.prisma.shopping_orders.findFirstOrThrow({
          where: {
            id: order.id,
            ...ShoppingOrderProvider.where(customer),
          },
          ...json.select(customer),
        });
      return json.transform(record);
    };

  export const discountable =
    (customer: IShoppingCustomer) =>
    (order: IEntity) =>
    async (
      input: IShoppingOrderDiscountable.IRequest,
    ): Promise<IShoppingOrderDiscountable> => {
      const reference: IShoppingOrder = await ShoppingOrderProvider.at(
        customer,
      )(order.id);
      if (reference.publish !== null)
        throw ErrorProvider.gone({
          accessor: "id",
          message: "Order has been already published.",
        });
      const price: IShoppingOrderPrice = await ShoppingOrderPriceProvider.at(
        customer,
      )({ id: order.id });
      const goods: IShoppingOrderGood[] =
        input.good_ids === null
          ? reference.goods
          : reference.goods.filter((good) =>
              input.good_ids!.some((id) => id === good.id),
            );
      if (input.good_ids !== null && input.good_ids.length !== goods.length)
        throw ErrorProvider.notFound({
          accessor: "input.good_ids",
          message: "Some goods are not found.",
        });
      return {
        mileage: customer.citizen
          ? (await ShoppingMileageHistoryProvider.getBalance(
              customer.citizen,
            )) + price.mileage
          : 0,
        deposit: customer.citizen
          ? (await ShoppingDepositHistoryProvider.getBalance(
              customer.citizen,
            )) + price.deposit
          : 0,
        combinations: ShoppingOrderDiscountableDiagnoser.combinate(customer)(
          await take(ShoppingCouponProvider.index(customer)),
          customer.citizen
            ? [
                ...(await take(ShoppingCouponTicketProvider.index(customer))),
                ...price.ticket_payments.map((tp) => tp.ticket),
              ]
            : [],
        )(goods),
      };
    };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const discount =
    (customer: IShoppingCustomer) =>
    (order: IEntity) =>
    async (
      input: IShoppingOrderPrice.ICreate,
    ): Promise<IShoppingOrderPrice> => {
      const { order: reference, combination } = await prepare(customer)(
        order.id,
      )(input);

      // HISTORIES OF DEPOSIT AND MILEAGE
      if (customer.citizen) {
        await ShoppingDepositHistoryProvider.emplace(customer.citizen)(
          "shopping_order_payment",
        )(reference, input.deposit);
        await ShoppingMileageHistoryProvider.emplace(customer.citizen)(
          "shopping_order_payment",
        )(reference, () => input.mileage);
      }

      // DISTRIBUTE DISCOUNTS TO EACH ORDER ITEMS
      for (const good of reference.goods) {
        const ratio = good.price.real / reference.price.real;
        const share = {
          deposit: input.deposit * ratio,
          mileage: input.mileage * ratio,
          ticket: (combination?.amount ?? 0) * ratio,
        };
        await ShoppingGlobal.prisma.mv_shopping_order_good_prices.update({
          where: {
            shopping_order_good_id: good.id,
          },
          data: {
            cash:
              good.price.real - share.deposit - share.mileage - share.ticket,
            deposit: share.deposit,
            mileage: share.mileage,
            ticket: share.ticket,
          },
        });
      }

      // FINALIZE
      await ShoppingGlobal.prisma.mv_shopping_order_prices.update({
        where: {
          shopping_order_id: order.id,
        },
        data: {
          ticket: combination?.amount ?? 0,
        },
      });
      const reloaded = await ShoppingGlobal.prisma.shopping_orders.update({
        where: {
          id: order.id,
        },
        data: {
          cash:
            reference.price.real -
            input.deposit -
            input.mileage -
            (combination?.amount ?? 0),
          deposit: input.deposit,
          mileage: input.mileage,
        },
        ...json.select(customer),
      });
      return json.transform(reloaded);
    };

  const prepare =
    (customer: IShoppingCustomer) =>
    (id: string) =>
    async (input: IShoppingOrderPrice.ICreate): Promise<IAsset> => {
      // FIND ORDER
      const order: IShoppingOrder = await ShoppingOrderProvider.at(customer)(
        id,
      );
      if (order.publish !== null)
        throw ErrorProvider.gone({
          accessor: "id",
          message: "Order has been already published.",
        });

      // VALIDATE BALANCES
      const deposit: number =
        customer.citizen !== null
          ? (await ShoppingDepositHistoryProvider.getBalance(
              customer.citizen,
            )) + order.price.deposit
          : 0;
      const mileage: number =
        customer.citizen !== null
          ? (await ShoppingMileageHistoryProvider.getBalance(
              customer.citizen,
            )) + order.price.mileage
          : 0;
      if (deposit < input.deposit)
        throw ErrorProvider.unprocessable({
          accessor: "input.deposit",
          message: "Not enough deposit.",
        });
      if (mileage < input.mileage)
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
      if (input.coupon_ids.length === 0)
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
                      in: input.coupon_ids,
                    },
                  },
                  ...ShoppingCouponTicketProvider.where(customer).AND,
                ],
              },
              ...ShoppingCouponTicketProvider.json.select(customer),
            }),
          )(ShoppingCouponTicketProvider.json.transform),
        );
      const coupons: IShoppingCoupon[] =
        tickets.length === input.coupon_ids.length
          ? []
          : await ArrayUtil.asyncMap(
              await ShoppingGlobal.prisma.shopping_coupons.findMany({
                where: {
                  AND: [
                    {
                      id: {
                        in: input.coupon_ids,
                      },
                    },
                    ...ShoppingCouponProvider.wherePossible().AND,
                  ],
                },
                ...ShoppingCouponProvider.json.select(customer),
              }),
            )(ShoppingCouponProvider.json.transform);
      if (tickets.length + coupons.length !== input.coupon_ids.length)
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
          ShoppingOrderDiscountableDiagnoser.checkCoupon(customer)(order.goods),
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
            ShoppingCouponTicketProvider.create(customer)({
              coupon_id: c.id,
            }),
          )),
        );

      // DO TICKET PAYMENTS
      await ArrayUtil.asyncMap(tickets)(
        ShoppingCouponTicketPaymentProvider.create(order),
      );

      // RETURNS
      const [combination] = ShoppingOrderDiscountableDiagnoser.combinate(
        customer,
      )(
        [],
        tickets,
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
  closure: (input: IPage.IRequest) => Promise<IPage<T>>,
): Promise<T[]> => {
  const page = await closure({ limit: 0 });
  return page.data;
};
