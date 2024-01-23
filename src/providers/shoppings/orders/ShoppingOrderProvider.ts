import { ArrayUtil } from "@nestia/e2e";
import { Prisma } from "@prisma/client";
import { IPointer } from "tstl";
import { v4 } from "uuid";

import { ShoppingOrderDiagnoser } from "@samchon/shopping-api/lib/diagnosers/shoppings/orders/ShoppingOrderDiagnoser";
import { IDiagnosis } from "@samchon/shopping-api/lib/structures/common/IDiagnosis";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderPrice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPrice";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { PaginationUtil } from "../../../utils/PaginationUtil";
import { ShoppingCustomerProvider } from "../actors/ShoppingCustomerProvider";
import { ShoppingDepositHistoryProvider } from "../deposits/ShoppingDepositHistoryProvider";
import { ShoppingMileageHistoryProvider } from "../mileages/ShoppingMileageHistoryProvider";
import { ShoppingSaleSnapshotProvider } from "../sales/ShoppingSaleSnapshotProvider";
import { ShoppingCartCommodityProvider } from "./ShoppingCartCommodityProvider";
import { ShoppingOrderGoodProvider } from "./ShoppingOrderGoodProvider";
import { ShoppingOrderPriceProvider } from "./ShoppingOrderPriceProvider";
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
          cash: input.cash,
          deposit: input.deposit,
          mileage: input.mileage,
          ticket: input.mv_price.ticket,
          ticket_payments: [], // @todo
        },
        created_at: input.created_at.toISOString(),
      };
    };
    export const select = (actor: null | IShoppingActorEntity) =>
      ({
        include: {
          customer: ShoppingCustomerProvider.json.select(),
          goods: ShoppingOrderGoodProvider.json.select(actor),
          publish: ShoppingOrderPublishProvider.json.select(actor),
          mv_price: true,
        },
      }) satisfies Prisma.shopping_ordersFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index =
    (actor: IShoppingActorEntity) =>
    async (input: IShoppingOrder.IRequest): Promise<IPage<IShoppingOrder>> =>
      PaginationUtil.paginate({
        schema: ShoppingGlobal.prisma.shopping_orders,
        payload: json.select(actor),
        transform: json.transform,
      })({
        where: {
          AND: [where(actor), ...(await search(input.search))],
        },
        orderBy: input.sort?.length
          ? PaginationUtil.orderBy(orderBy)(input.sort)
          : [{ created_at: "desc" }],
      })(input);

  export const at =
    (actor: IShoppingActorEntity) =>
    async (id: string): Promise<IShoppingOrder> => {
      const record =
        await ShoppingGlobal.prisma.shopping_orders.findFirstOrThrow({
          where: {
            id,
            ...where(actor),
          },
          ...json.select(actor),
        });
      return json.transform(record);
    };

  export const where = (actor: IShoppingActorEntity) =>
    (actor.type === "customer"
      ? {
          customer: ShoppingCustomerProvider.where(actor),
          deleted_at: null,
        }
      : actor.type === "seller"
        ? {
            goods: {
              some: {
                shopping_seller_id: actor.id,
              },
            },
            publish: { isNot: null },
            deleted_at: null,
          }
        : {
            publish: { isNot: null },
            deleted_at: null,
          }) satisfies Prisma.shopping_ordersWhereInput;

  const search = async (input: IShoppingOrder.IRequest.ISearch | undefined) =>
    [
      ...(input?.min_price !== undefined
        ? [
            {
              mv_price: {
                real: {
                  gte: input.min_price,
                },
              },
            },
          ]
        : []),
      ...(input?.max_price !== undefined
        ? [
            {
              mv_price: {
                real: {
                  lte: input.max_price,
                },
              },
            },
          ]
        : []),
      ...(input?.paid !== undefined
        ? [
            {
              publish: {
                paid_at: input.paid === false ? null : { not: null },
              },
            },
          ]
        : []),
      ...(
        await ShoppingSaleSnapshotProvider.searchInvert("input.search.sale")(
          input?.sale,
        )
      ).map((snapshot) => ({
        goods: {
          some: {
            commodity: {
              snapshot,
            },
          },
        },
      })),
    ] satisfies Prisma.shopping_ordersWhereInput["AND"];

  const orderBy = (
    key: IShoppingOrder.IRequest.SortableColumns,
    value: "asc" | "desc",
  ) =>
    (key === "order.created_at"
      ? { created_at: value }
      : key === "order.publish.paid_at"
        ? { publish: { paid_at: value } }
        : key === "order.quantity"
          ? {
              mv_price: { quantity: value },
            }
          : {
              mv_price: { real: value },
            }) satisfies Prisma.shopping_ordersOrderByWithRelationInput;

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create =
    (customer: IShoppingCustomer) =>
    async (input: IShoppingOrder.ICreate): Promise<IShoppingOrder> => {
      // FIND MATCHED COMMODITIES
      const commodities: IShoppingCartCommodity[] = await ArrayUtil.asyncMap(
        await ShoppingGlobal.prisma.shopping_cart_commodities.findMany({
          where: {
            id: {
              in: input.goods.map((good) => good.commodity_id),
            },
            cart: {
              customer: ShoppingCustomerProvider.where(customer),
            },
          },
          ...ShoppingCartCommodityProvider.json.select(),
        }),
      )(ShoppingCartCommodityProvider.json.transform);

      // VALIDATE
      const diagnoses: IDiagnosis[] =
        ShoppingOrderDiagnoser.validate(commodities)(input);
      if (diagnoses.length) throw ErrorProvider.unprocessable(diagnoses);

      // COLLECT GOODS
      const quantity: IPointer<number> = { value: 0 };
      const goods = input.goods.map((raw, i) => {
        const commodity: IShoppingCartCommodity = commodities.find(
          (c) => c.id === raw.commodity_id,
        )!;
        quantity.value +=
          raw.volume *
          commodity.sale.units
            .map((u) => u.stocks.map((s) => s.quantity))
            .flat()
            .reduce((a, b) => a + b);
        return ShoppingOrderGoodProvider.collect({
          id: commodity.sale.seller.id,
        })(commodity)(raw, i);
      });

      // DO ARCHIVE
      const record = await ShoppingGlobal.prisma.shopping_orders.create({
        data: {
          id: v4(),
          customer: {
            connect: {
              id: customer.id,
            },
          },
          goods: {
            create: goods,
          },
          cash: goods
            .map((g) => g.mv_price.create.cash)
            .reduce((x, y) => x + y),
          mileage: 0,
          deposit: 0,
          created_at: new Date(),
          deleted_at: null,
          mv_price: {
            create: {
              quantity: quantity.value,
              nominal: goods
                .map((g) => g.mv_price.create.nominal)
                .reduce((x, y) => x + y),
              real: goods
                .map((g) => g.mv_price.create.real)
                .reduce((x, y) => x + y),
              ticket: 0,
            },
          },
        },
        ...json.select(customer),
      });
      return json.transform(record);
    };

  export const erase =
    (customer: IShoppingCustomer) =>
    async (id: string): Promise<void> => {
      const record =
        await ShoppingGlobal.prisma.shopping_orders.findFirstOrThrow({
          where: {
            id,
            ...where(customer),
          },
          include: {
            ...ShoppingOrderPriceProvider.json.select(customer).include,
            publish: true,
          },
        });
      if (record.publish !== null)
        throw ErrorProvider.gone({
          accessor: "id",
          message: "Order has already been published.",
        });

      const price: IShoppingOrderPrice =
        await ShoppingOrderPriceProvider.json.transform(record);

      if (customer.citizen) {
        if (price.deposit)
          await ShoppingDepositHistoryProvider.cancel(customer.citizen)(
            "shopping_order_payment",
          )(record);
        if (price.ticket)
          await ShoppingMileageHistoryProvider.cancel(customer.citizen)(
            "shopping_order_payment",
          )(record);
        if (price.ticket_payments.length)
          await ShoppingGlobal.prisma.shopping_coupon_ticket_payments.deleteMany(
            {
              where: {
                id: {
                  in: price.ticket_payments.map((ctp) => ctp.id),
                },
              },
            },
          );
      }
      await ShoppingGlobal.prisma.shopping_orders.update({
        where: {
          id,
        },
        data: {
          deleted_at: new Date(),
        },
      });
    };
}
