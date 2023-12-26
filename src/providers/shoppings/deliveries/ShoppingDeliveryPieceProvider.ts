import { ArrayUtil } from "@nestia/e2e";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IShoppingDelivery } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDelivery";
import { IShoppingDeliveryPiece } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryPiece";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";

import { ShoppingAddressProvider } from "../actors/ShoppingAddressProvider";
import { ShoppingOrderProvider } from "../orders/ShoppingOrderProvider";
import { ShoppingDeliveryProvider } from "./ShoppingDeliveryProvider";

export namespace ShoppingDeliveryPieceProvider {
  /* -----------------------------------------------------------
    TRANSFOMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_delivery_piecesGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingDeliveryPiece => ({
      id: input.id,
      publish_id: input.shopping_order_publish_id,
      good_id: input.shopping_order_good_id,
      stock_id: input.shopping_sale_snapshot_unit_stock_id,
      quantity: input.quantity,
    });
    export const select = () =>
      ({} satisfies Prisma.shopping_delivery_piecesFindManyArgs);
  }

  export namespace jsonFromPublish {
    export const transform = (
      inputList: Prisma.shopping_delivery_piecesGetPayload<
        ReturnType<typeof select>
      >[],
    ): IShoppingDelivery[] => {
      const deliveries = new Map(
        inputList.map((input) => [input.delivery.id, input.delivery]),
      );
      const resolved: Map<string, IShoppingDelivery> = new Map(
        [...deliveries].map(([id, di]) => [
          id,
          {
            ...ShoppingDeliveryProvider.jsonFromPublish.transform(di),
            pieces: [],
          },
        ]),
      );
      for (const input of inputList)
        resolved.get(input.delivery.id)!.pieces.push({
          id: input.id,
          publish_id: input.shopping_order_publish_id,
          good_id: input.shopping_order_good_id,
          stock_id: input.shopping_sale_snapshot_unit_stock_id,
          quantity: input.quantity,
        });
      return [...resolved.values()];
    };
    export const select = () =>
      ({
        include: {
          delivery: ShoppingDeliveryProvider.jsonFromPublish.select(),
        },
      } satisfies Prisma.shopping_delivery_piecesFindManyArgs);
  }

  export namespace invert {
    export const transform = async (
      inputList: Prisma.shopping_delivery_piecesGetPayload<
        ReturnType<typeof select>
      >[],
    ): Promise<Pick<IShoppingDelivery.IInvert, "orders" | "pieces">> => {
      const tuples = new Map(
        inputList.map((input) => [
          input.publish.order.id,
          {
            order: input.publish.order,
            publish: input.publish,
          },
        ]),
      );
      const orders: IShoppingOrder.IInvertFromDelivery[] =
        await ArrayUtil.asyncMap([...tuples.values()])(
          async ({ order, publish }) => ({
            ...(await ShoppingOrderProvider.json.transform({
              ...order,
              publish: null,
            })),
            publish: {
              id: publish.id,
              address: ShoppingAddressProvider.json.transform(publish.address),
              created_at: publish.created_at.toISOString(),
              paid_at: publish.paid_at?.toISOString() ?? null,
              cancelled_at: publish.cancelled_at?.toISOString() ?? null,
            },
          }),
        );
      orders.forEach(
        (o) =>
          (o.goods = o.goods.filter((good) =>
            inputList.some((p) => p.shopping_order_good_id === good.id),
          )),
      );
      return {
        orders,
        pieces: inputList.map(json.transform),
      };
    };
    export const select = () =>
      ({
        include: {
          publish: {
            include: {
              address: true,
              order: {
                include: {
                  ...ShoppingOrderProvider.json.select().include,
                  publish: undefined,
                },
              },
            },
          },
        },
      } satisfies Prisma.shopping_delivery_piecesFindManyArgs);
  }

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const collect = (
    input: IShoppingDeliveryPiece.ICreate,
    sequence: number,
  ) =>
    ({
      id: v4(),
      publish: { connect: { id: input.publish_id } },
      good: { connect: { id: input.good_id } },
      stock: { connect: { id: input.stock_id } },
      quantity: input.quantity,
      sequence,
    } satisfies Prisma.shopping_delivery_piecesCreateWithoutDeliveryInput);
}
