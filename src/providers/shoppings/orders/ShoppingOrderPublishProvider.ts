import { RandomGenerator } from "@nestia/e2e";
import { AesPkcs5 } from "@nestia/fetcher/lib/AesPkcs5";
import { Prisma } from "@prisma/client";
import typia from "typia";
import { v4 } from "uuid";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingDelivery } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDelivery";
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
      >
    ): IShoppingOrderPublish => ({
      id: input.id,
      address: ShoppingAddressProvider.json.transform(input.address),
      deliveries: ShoppingDeliveryPieceProvider.jsonFromPublish.transform(
        input.pieces
      ),
      state: typia.assert<IShoppingDelivery.State>(
        input.mv_state?.value ?? input.mv_seller_states?.[0]?.value ?? "none"
      ),
      created_at: input.created_at.toISOString(),
      paid_at: input.paid_at?.toISOString() ?? null,
      cancelled_at: input.cancelled_at?.toISOString() ?? null,
    });
    export const select = (actor: null | IShoppingActorEntity) =>
      ({
        include: {
          pieces: ShoppingDeliveryPieceProvider.jsonFromPublish.select(),
          address: true,
          mv_state: actor?.type === "seller" ? undefined : true,
          mv_seller_states:
            actor?.type === "seller"
              ? {
                  where: {
                    shopping_seller_id: actor.id,
                  },
                }
              : undefined,
        },
      }) satisfies Prisma.shopping_order_publishesFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const able = async (props: {
    customer: IShoppingCustomer;
    order: IEntity;
  }): Promise<boolean> => (await knock(props)) !== null;

  const knock = async (props: {
    customer: IShoppingCustomer;
    order: IEntity;
  }) => {
    const record = await ShoppingGlobal.prisma.shopping_orders.findFirstOrThrow(
      {
        where: {
          id: props.order.id,
          customer: ShoppingCustomerProvider.where(props.customer),
          deleted_at: null,
        },
        include: {
          publish: true,
        },
      }
    );
    return record.publish === null ? record : null;
  };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create = async (props: {
    customer: IShoppingCustomer;
    order: IEntity;
    input: IShoppingOrderPublish.ICreate;
  }): Promise<IShoppingOrderPublish> => {
    // PRELIMINARIES
    const reference = await knock(props);
    if (reference === null)
      throw ErrorProvider.gone({
        accessor: "id",
        message: "The order already has been published.",
      });
    const next: {
      created_at: Date;
      paid_at: null | Date;
      cancelled_at: null | Date;
    } = await (async () => {
      if (props.input.vendor === null) {
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
        vendor: props.input.vendor.code,
        uid: props.input.vendor.uid,
        orderId: props.order.id,
        amount: reference.cash,
      });
    })();

    // DO ARCHIVE
    const publish = await ShoppingGlobal.prisma.shopping_order_publishes.create(
      {
        data: {
          id: v4(),
          order: {
            connect: { id: props.order.id },
          },
          address: {
            create: ShoppingAddressProvider.collect(props.input.address),
          },
          password:
            props.input.vendor === null
              ? null
              : encrypt(RandomGenerator.alphabets(16)),
          created_at: next.created_at,
          paid_at: next.paid_at,
          cancelled_at: next.cancelled_at,
        },
        ...json.select(props.customer),
      }
    );

    // POST-PROCESSING
    await ShoppingGlobal.prisma.shopping_cart_commodities.updateMany({
      data: {
        published: true,
      },
      where: {
        order_goods: {
          some: {
            shopping_order_id: props.order.id,
          },
        },
      },
    });
    if (next.paid_at !== null && next.cancelled_at === null)
      await handlePayment(props.order);
    return json.transform(publish);
  };

  export const cancel = async (props: {
    customer: IShoppingCustomer;
    order: IEntity;
  }): Promise<void> => {
    const record =
      await ShoppingGlobal.prisma.shopping_order_publishes.findFirstOrThrow({
        where: {
          order: {
            id: props.order.id,
            customer: ShoppingCustomerProvider.where(props.customer),
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
    await handleCancel(props.order);
  };

  const handlePayment = async (
    order: IEntity,
    refer?: { publish: null | IEntity; goods: IEntity[] }
  ) => {
    // STATES OF DELIVERIES
    if (refer === undefined)
      refer = await ShoppingGlobal.prisma.shopping_orders.findFirstOrThrow({
        where: {
          id: order.id,
        },
        include: {
          publish: true,
          goods: true,
        },
      });
    await ShoppingGlobal.prisma.mv_shopping_order_publish_states.create({
      data: {
        shopping_order_publish_id: refer.publish!.id,
        value: "none",
      },
    });
    await ShoppingGlobal.prisma.mv_shopping_order_good_states.createMany({
      data: refer.goods.map((good) => ({
        shopping_order_good_id: good.id,
        value: "none",
      })),
    });
    await ShoppingGlobal.prisma.mv_shopping_order_publish_seller_states.createMany(
      {
        data: [
          ...new Set(
            (
              await ShoppingGlobal.prisma.shopping_order_goods.findMany({
                where: {
                  shopping_order_id: order.id,
                },
                select: {
                  shopping_seller_id: true,
                },
              })
            ).map((og) => og.shopping_seller_id)
          ),
        ].map((shopping_seller_id) => ({
          id: v4(),
          shopping_order_publish_id: refer!.publish!.id,
          shopping_seller_id,
          value: "none",
        })),
      }
    );

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
        }
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
        }
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
        }))
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
