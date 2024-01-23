import { ArrayUtil } from "@nestia/e2e";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IDiagnosis } from "@samchon/shopping-api/lib/structures/common/IDiagnosis";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingDelivery } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDelivery";
import { IShoppingDeliveryPiece } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryPiece";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
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
      ({}) satisfies Prisma.shopping_delivery_piecesFindManyArgs;
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
      }) satisfies Prisma.shopping_delivery_piecesFindManyArgs;
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
    export const select = (actor: null | IShoppingActorEntity) =>
      ({
        include: {
          publish: {
            include: {
              address: true,
              order: {
                include: {
                  ...ShoppingOrderProvider.json.select(actor).include,
                  publish: undefined,
                },
              },
            },
          },
        },
      }) satisfies Prisma.shopping_delivery_piecesFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const incompletes =
    (seller: IShoppingSeller.IInvert) =>
    async (
      input: IShoppingDeliveryPiece.IRequest,
    ): Promise<IShoppingDeliveryPiece.ICreate[]> => {
      const [publishes, pieces] = await getIncompletes(seller)(input);

      const notFounds: IDiagnosis[] = [];
      const unprocessables: IDiagnosis[] = [];

      input.publish_ids.forEach((publish_id, i) => {
        const publish = publishes.find((p) => p.id === publish_id);
        if (publish === undefined)
          notFounds.push({
            accessor: `input.publish_ids[${i}]`,
            message: `Unable to find the matched publish record.`,
          });
        else if (publish.paid_at === null)
          unprocessables.push({
            accessor: `input.publish_ids[${i}]`,
            message: `Target publish has not been paid yet.`,
          });
        else if (publish.cancelled_at !== null)
          unprocessables.push({
            accessor: `input.publish_ids[${i}]`,
            message: `Target publish has been cancelled.`,
          });
      });
      if (notFounds.length > 0) throw ErrorProvider.notFound(notFounds);
      else if (unprocessables.length > 0)
        throw ErrorProvider.unprocessable(unprocessables);

      return pieces;
    };

  export const getIncompletes =
    (seller: IShoppingSeller.IInvert) =>
    async (input: IShoppingDeliveryPiece.IRequest) => {
      const publishes =
        await ShoppingGlobal.prisma.shopping_order_publishes.findMany({
          include: {
            order: {
              include: {
                goods: {
                  where: {
                    shopping_seller_id: seller.id,
                  },
                  include: {
                    delivery_pieces: true,
                    commodity: {
                      include: {
                        stocks: true,
                      },
                    },
                  },
                },
              },
            },
          },
          where: {
            id: {
              in: input.publish_ids,
            },
          },
        });
      return [
        publishes,
        publishes
          .map((publish) =>
            publish.order.goods.map((good) =>
              good.commodity.stocks.map((stock) => ({
                publish_id: publish.id,
                good_id: good.id,
                stock_id: stock.shopping_sale_snapshot_unit_stock_id,
                quantity:
                  good.volume * stock.quantity -
                  good.delivery_pieces
                    .filter(
                      (p) =>
                        p.shopping_sale_snapshot_unit_stock_id ===
                        stock.shopping_sale_snapshot_unit_stock_id,
                    )
                    .map((p) => p.quantity)
                    .reduce((x, y) => x + y, 0),
              })),
            ),
          )
          .flat()
          .flat()
          .filter((p) => p.quantity > 0),
      ] as const;
    };

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
    }) satisfies Prisma.shopping_delivery_piecesCreateWithoutDeliveryInput;
}
