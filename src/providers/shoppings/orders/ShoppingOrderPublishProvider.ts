import { RandomGenerator } from "@nestia/e2e";
import { AesPkcs5 } from "@nestia/fetcher/lib/AesPkcs5";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingOrderPublish } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPublish";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { PaymentService } from "../../../services/PaymentService";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingAddressProvider } from "../actors/ShoppingAddressProvider";
import { ShoppingCustomerProvider } from "../actors/ShoppingCustomerProvider";
import { ShoppingDeliveryPieceProvider } from "../deliveries/ShoppingDeliveryPieceProvider";

export namespace ShoppingOrderPublishProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_order_publishesGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingOrderPublish => ({
      id: input.id,
      address: ShoppingAddressProvider.json.transform(input.address),
      deliveries: ShoppingDeliveryPieceProvider.jsonFromPublish.transform(
        input.pieces,
      ),
      state: (input.mv_state?.value ?? "none") as "none",
      created_at: input.created_at.toISOString(),
      paid_at: input.paid_at?.toISOString() ?? null,
      cancelled_at: input.cancelled_at?.toISOString() ?? null,
    });
    export const select = () =>
      ({
        include: {
          pieces: ShoppingDeliveryPieceProvider.jsonFromPublish.select(),
          address: true,
          mv_state: true,
        },
      } satisfies Prisma.shopping_order_publishesFindManyArgs);
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const able =
    (customer: IShoppingCustomer) => async (order: IEntity) => {
      const record =
        await ShoppingGlobal.prisma.shopping_orders.findFirstOrThrow({
          where: {
            id: order.id,
            customer: ShoppingCustomerProvider.where(customer),
            deleted_at: null,
          },
          include: {
            publish: true,
          },
        });
      if (record.publish !== null)
        throw ErrorProvider.gone({
          accessor: "id",
          message: "The order already has been published.",
        });
      return record;
    };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create =
    (customer: IShoppingCustomer) =>
    (order: IEntity) =>
    async (
      input: IShoppingOrderPublish.ICreate,
    ): Promise<IShoppingOrderPublish> => {
      // PRELIMINARIES
      const reference = await able(customer)(order);
      const props: {
        created_at: Date;
        paid_at: null | Date;
        cancelled_at: null | Date;
      } = await (async () => {
        if (input.type === "zero") {
          if (reference.cash !== 0)
            throw ErrorProvider.unprocessable({
              accessor: "input.type",
              message: "The order is not free.",
            });
          return {
            created_at: new Date(),
            paid_at: new Date(),
            cancelled_at: null,
          };
        }
        return PaymentService.enroll({
          vendor: input.vendor,
          uid: input.uid,
          orderId: order.id,
          amount: reference.cash,
        });
      })();

      // DO ARCHIVE
      const publish =
        await ShoppingGlobal.prisma.shopping_order_publishes.create({
          data: {
            id: v4(),
            order: {
              connect: { id: order.id },
            },
            address: {
              create: ShoppingAddressProvider.collect(input.address),
            },
            password:
              input.type === "zero"
                ? null
                : encrypt(RandomGenerator.alphabets(16)),
            created_at: props.created_at,
            paid_at: props.paid_at,
            cancelled_at: props.cancelled_at,
          },
          ...json.select(),
        });

      // POST-PROCESSING
      await ShoppingGlobal.prisma.shopping_cart_commodities.updateMany({
        data: {
          published: true,
        },
        where: {
          order_goods: {
            some: {
              shopping_order_id: order.id,
            },
          },
        },
      });
      if (props.paid_at !== null && props.cancelled_at === null)
        await handlePayment(order);
      return json.transform(publish);
    };

  export const cancel =
    (customer: IShoppingCustomer) =>
    async (order: IEntity): Promise<void> => {
      const record =
        await ShoppingGlobal.prisma.shopping_order_publishes.findFirstOrThrow({
          where: {
            order: {
              id: order.id,
              customer: ShoppingCustomerProvider.where(customer),
            },
          },
        });
      if (record.paid_at === null)
        throw ErrorProvider.unprocessable({
          accessor: "id",
          message: "The order has not been paid yet.",
        });
      else if (record.cancelled_at !== null)
        throw ErrorProvider.gone({
          accessor: "id",
          message: "The order has already been cancelled.",
        });

      await ShoppingGlobal.prisma.shopping_order_publishes.update({
        where: { id: record.id },
        data: {
          cancelled_at: new Date(),
        },
      });
      await handleCancel(order);
    };

  const handlePayment = async (order: IEntity) => {
    // DECREASE INVENTORY
    for (const { stock_id, quantity } of await getStocks(order))
      await ShoppingGlobal.prisma.mv_shopping_sale_snapshot_unit_stock_inventories.update(
        {
          where: {
            shopping_sale_snapshot_unit_stock_id: stock_id,
          },
          data: {
            outcome: {
              increment: quantity,
            },
          },
        },
      );
  };

  const handleCancel = async (order: IEntity) => {
    // INCREASE INVENTORY
    for (const { stock_id, quantity } of await getStocks(order))
      await ShoppingGlobal.prisma.mv_shopping_sale_snapshot_unit_stock_inventories.update(
        {
          where: {
            shopping_sale_snapshot_unit_stock_id: stock_id,
          },
          data: {
            outcome: {
              decrement: quantity,
            },
          },
        },
      );

    // @todo - ROLL-BACK DISCOUNTS
  };

  const getStocks = async (order: IEntity): Promise<IStockQuantity[]> => {
    const goodList = await ShoppingGlobal.prisma.shopping_order_goods.findMany({
      where: {
        shopping_order_id: order.id,
      },
      include: {
        commodity: {
          include: {
            stocks: true,
          },
        },
      },
    });
    return goodList
      .map((good) =>
        good.commodity.stocks.map((s) => ({
          stock_id: s.shopping_sale_snapshot_unit_stock_id,
          quantity: s.quantity * good.volume,
        })),
      )
      .flat();
  };

  // const decrypt = (str: string): string => AesPkcs5.decrypt(str, KEY, IV);
  const encrypt = (str: string): string => AesPkcs5.encrypt(str, KEY, IV);
}

const KEY = "1ejeh9i3v2tlxbj5ueuyhn85kc3woqwv";
const IV = "cuks39ovlcu4htzw";

interface IStockQuantity {
  stock_id: string;
  quantity: number;
}
