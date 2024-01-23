import { Prisma } from "@prisma/client";
import typia from "typia";
import { v4 } from "uuid";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingDelivery } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDelivery";
import { IShoppingDeliveryJourney } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryJourney";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingDeliveryPieceProvider } from "./ShoppingDeliveryPieceProvider";
import { ShoppingDeliveryProvider } from "./ShoppingDeliveryProvider";

export namespace ShoppingDeliveryJourneyProvider {
  /* -----------------------------------------------------------
    TRANSFOMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_delivery_journeysGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingDeliveryJourney => ({
      id: input.id,
      type: input.type as "preparing",
      title: input.title,
      description: input.description,
      created_at: input.created_at.toISOString(),
      started_at: input.started_at?.toISOString() ?? null,
      completed_at: input.completed_at?.toISOString() ?? null,
      deleted_at: input.deleted_at?.toISOString() ?? null,
    });
    export const select = () =>
      ({}) satisfies Prisma.shopping_delivery_journeysFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const at =
    (seller: IShoppingSeller.IInvert) =>
    (delivery: IEntity) =>
    async (id: string): Promise<IShoppingDeliveryJourney> => {
      const record =
        await ShoppingGlobal.prisma.shopping_delivery_journeys.findFirstOrThrow(
          {
            where: {
              id,
              delivery: {
                id: delivery.id,
                sellerCustomer: {
                  member: {
                    of_seller: {
                      id: seller.id,
                    },
                  },
                },
              },
            },
            ...json.select(),
          },
        );
      return json.transform(record);
    };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create =
    (seller: IShoppingSeller.IInvert) =>
    (delivery: IEntity) =>
    async (
      input: IShoppingDeliveryJourney.ICreate,
    ): Promise<IShoppingDeliveryJourney> => {
      await ShoppingDeliveryProvider.find({})(seller)(delivery.id);
      const record =
        await ShoppingGlobal.prisma.shopping_delivery_journeys.create({
          data: {
            ...collect(input, 0),
            shopping_delivery_id: delivery.id,
          },
          ...json.select(),
        });
      await updateStates(seller)(delivery)(
        input.type === "delivering" && input.completed_at !== null
          ? "arrived"
          : input.type,
      );
      return json.transform(record);
    };

  export const complete =
    (seller: IShoppingSeller.IInvert) =>
    (delivery: IEntity) =>
    (id: string) =>
    async (input: IShoppingDeliveryJourney.IComplete): Promise<void> => {
      const current: IShoppingDeliveryJourney = await at(seller)(delivery)(id);
      if (current.completed_at !== null)
        throw ErrorProvider.gone({
          accessor: "id",
          message: "Already completed",
        });

      await ShoppingGlobal.prisma.shopping_delivery_journeys.update({
        where: {
          id,
        },
        data: {
          completed_at: input.completed_at ?? new Date(),
        },
      });
      if (current.type === "delivering")
        await updateStates(seller)(delivery)("arrived");
    };

  export const erase =
    (seller: IShoppingSeller.IInvert) =>
    (delivery: IEntity) =>
    async (id: string): Promise<void> => {
      const current: IShoppingDeliveryJourney = await at(seller)(delivery)(id);
      await ShoppingGlobal.prisma.shopping_delivery_journeys.update({
        where: {
          id: current.id,
        },
        data: {
          deleted_at: new Date(),
        },
      });

      const last =
        await ShoppingGlobal.prisma.shopping_delivery_journeys.findFirst({
          where: {
            shopping_delivery_id: delivery.id,
            deleted_at: null,
          },
          orderBy: [
            {
              created_at: "desc",
            },
            {
              sequence: "desc",
            },
          ],
        });
      await updateStates(seller)(delivery)(
        last === null
          ? "none"
          : typia.assert<IShoppingDeliveryJourney.Type>(last.type),
      );
    };

  export const collect = (
    input: IShoppingDeliveryJourney.ICreate,
    sequence: number,
  ) =>
    ({
      id: v4(),
      type: typia.assert<IShoppingDeliveryJourney.Type>(input.type),
      title: input.title,
      description: input.description,
      started_at: input.started_at,
      completed_at: input.completed_at,
      deleted_at: null,
      created_at: new Date(),
      sequence,
    }) satisfies Prisma.shopping_delivery_journeysCreateWithoutDeliveryInput;

  const updateStates =
    (seller: IShoppingSeller.IInvert) =>
    (delivery: IEntity) =>
    async (state: IShoppingDelivery.State): Promise<void> => {
      const reference =
        await ShoppingGlobal.prisma.shopping_deliveries.findFirstOrThrow({
          where: {
            id: delivery.id,
          },
          include: {
            pieces: ShoppingDeliveryPieceProvider.json.select(),
          },
        });
      await ShoppingDeliveryProvider.setState({
        root: true,
        incompletes: await ShoppingDeliveryPieceProvider.incompletes(seller)({
          publish_ids: [
            ...new Set(
              reference.pieces.map((p) => p.shopping_order_publish_id),
            ),
          ],
        }),
        delivery,
        pieces: reference.pieces.map(
          ShoppingDeliveryPieceProvider.json.transform,
        ),
      })(state);
    };
}
