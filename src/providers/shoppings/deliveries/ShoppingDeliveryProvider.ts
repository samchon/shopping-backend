import { Prisma } from "@prisma/client";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingDelivery } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDelivery";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { PaginationUtil } from "../../../utils/PaginationUtil";
import { ShoppingSellerProvider } from "../actors/ShoppingSellerProvider";
import { ShoppingDeliveryJourneyProvider } from "./ShoppingDeliveryJourneyProvider";
import { ShoppingDeliveryPieceProvider } from "./ShoppingDeliveryPieceProvider";
import { ShoppingDeliveryShipperProvider } from "./ShoppingDeliveryShipperProvider";

export namespace ShoppingDeliveryProvider {
  /* -----------------------------------------------------------
    TRANSFOMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_deliveriesGetPayload<ReturnType<typeof select>>,
    ): IShoppingDelivery => ({
      id: input.id,
      seller: ShoppingSellerProvider.invert.transform()(input.sellerCustomer),
      journeys: input.journeys.map(
        ShoppingDeliveryJourneyProvider.json.transform,
      ),
      shippers: input.shippers.map(
        ShoppingDeliveryShipperProvider.json.transform,
      ),
      pieces: input.pieces.map(ShoppingDeliveryPieceProvider.json.transform),
      state: "none", // @todo
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({
        include: {
          sellerCustomer: ShoppingSellerProvider.invert.select(),
          shippers: ShoppingDeliveryShipperProvider.json.select(),
          journeys: ShoppingDeliveryJourneyProvider.json.select(),
          pieces: ShoppingDeliveryPieceProvider.json.select(),
        },
      } satisfies Prisma.shopping_deliveriesFindManyArgs);
  }

  export namespace jsonFromPublish {
    export const transform = (
      input: Prisma.shopping_deliveriesGetPayload<ReturnType<typeof select>>,
    ): Omit<IShoppingDelivery, "pieces"> => ({
      id: input.id,
      seller: ShoppingSellerProvider.invert.transform()(input.sellerCustomer),
      journeys: input.journeys.map(
        ShoppingDeliveryJourneyProvider.json.transform,
      ),
      shippers: input.shippers.map(
        ShoppingDeliveryShipperProvider.json.transform,
      ),
      state: (input.mv_state?.value ?? "none") as "none",
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({
        include: {
          sellerCustomer: ShoppingSellerProvider.invert.select(),
          shippers: ShoppingDeliveryShipperProvider.json.select(),
          journeys: ShoppingDeliveryJourneyProvider.json.select(),
          mv_state: true,
        },
      } satisfies Prisma.shopping_deliveriesFindManyArgs);
  }

  export namespace invert {
    export const transform = async (
      input: Prisma.shopping_deliveriesGetPayload<ReturnType<typeof select>>,
    ): Promise<IShoppingDelivery.IInvert> => ({
      ...(await ShoppingDeliveryPieceProvider.invert.transform(input.pieces)),
      id: input.id,
      seller: ShoppingSellerProvider.invert.transform()(input.sellerCustomer),
      journeys: input.journeys.map(
        ShoppingDeliveryJourneyProvider.json.transform,
      ),
      shippers: input.shippers.map(
        ShoppingDeliveryShipperProvider.json.transform,
      ),
      state: "none", // @todo
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({
        include: {
          sellerCustomer: ShoppingSellerProvider.invert.select(),
          shippers: ShoppingDeliveryShipperProvider.json.select(),
          journeys: ShoppingDeliveryJourneyProvider.json.select(),
          pieces: ShoppingDeliveryPieceProvider.invert.select(),
        },
      } satisfies Prisma.shopping_deliveriesFindManyArgs);
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index =
    (seller: IShoppingSeller.IInvert) =>
    (
      input: IShoppingDelivery.IRequest,
    ): Promise<IPage<IShoppingDelivery.IInvert>> =>
      PaginationUtil.paginate({
        schema: ShoppingGlobal.prisma.shopping_deliveries,
        payload: invert.select(),
        transform: invert.transform,
      })({
        where: {
          sellerCustomer: {
            member: {
              of_seller: {
                id: seller.id,
              },
            },
          },
        },
        orderBy: input.sort?.length
          ? PaginationUtil.orderBy(orderBy)(input.sort)
          : [{ created_at: "desc" }],
      })(input);

  export const at =
    (seller: IShoppingSeller.IInvert) =>
    async (id: string): Promise<IShoppingDelivery.IInvert> => {
      const record =
        await ShoppingGlobal.prisma.shopping_deliveries.findFirstOrThrow({
          where: {
            id,
            sellerCustomer: {
              member: {
                of_seller: {
                  id: seller.id,
                },
              },
            },
          },
          ...invert.select(),
        });
      return invert.transform(record);
    };

  export const find =
    <Payload extends Prisma.shopping_deliveriesFindManyArgs>(
      payload: Payload,
    ) =>
    (seller: IShoppingSeller.IInvert) =>
    async (
      id: string,
    ): Promise<Prisma.shopping_deliveriesGetPayload<Payload>> => {
      const record =
        await ShoppingGlobal.prisma.shopping_deliveries.findFirstOrThrow({
          ...payload,
          where: {
            id,
            sellerCustomer: {
              member: {
                of_seller: {
                  id: seller.id,
                },
              },
            },
          },
        });
      return record as Prisma.shopping_deliveriesGetPayload<Payload>;
    };

  const orderBy = (
    _key: IShoppingDelivery.IRequest.SortableColumns,
    value: "asc" | "desc",
  ) =>
    ({
      created_at: value,
    } satisfies Prisma.shopping_deliveriesOrderByWithRelationInput);

  // /* -----------------------------------------------------------
  //   WRITERS
  // ----------------------------------------------------------- */
  // export const create =
  //   (seller: IShoppingSeller.IInvert) =>
  //   async (input: IShoppingDelivery.ICreate): Promise<IShoppingDelivery> => {
  //     const orderList = await ShoppingGlobal.prisma.shopping_orders.findMany({
  //       include: {
  //         publish: {
  //           include: {
  //             pieces: true,
  //           },
  //         },
  //         goods: {
  //           include: {
  //             commodity: {
  //               include: {
  //                 stocks: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  //   };
}
