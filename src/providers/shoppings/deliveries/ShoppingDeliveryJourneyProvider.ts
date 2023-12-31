import { Prisma } from "@prisma/client";
import typia from "typia";
import { v4 } from "uuid";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingDeliveryJourney } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryJourney";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
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
      ({} satisfies Prisma.shopping_delivery_journeysFindManyArgs);
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
            ...collect(input),
            shopping_delivery_id: delivery.id,
          },
          ...json.select(),
        });
      return json.transform(record);
    };

  export const complete =
    (seller: IShoppingSeller.IInvert) =>
    (delivery: IEntity) =>
    (id: string) =>
    async (input: IShoppingDeliveryJourney.IComplete): Promise<void> => {
      const prev: IShoppingDeliveryJourney = await at(seller)(delivery)(id);
      prev; // @todo -> change state

      await ShoppingGlobal.prisma.shopping_delivery_journeys.update({
        where: {
          id,
        },
        data: {
          completed_at: input.completed_at ?? new Date(),
        },
      });
    };

  export const update =
    (seller: IShoppingSeller.IInvert) =>
    (delivery: IEntity) =>
    (id: string) =>
    async (input: IShoppingDeliveryJourney.IUpdate): Promise<void> => {
      const prev: IShoppingDeliveryJourney = await at(seller)(delivery)(id);
      prev; // @todo -> change state

      await ShoppingGlobal.prisma.shopping_delivery_journeys.update({
        where: {
          id,
        },
        data: collectUpdate(input),
      });
    };

  export const erase =
    (seller: IShoppingSeller.IInvert) =>
    (delivery: IEntity) =>
    (id: string) =>
    async (): Promise<void> => {
      await ShoppingDeliveryProvider.find({})(seller)(delivery.id);
      await ShoppingGlobal.prisma.shopping_delivery_journeys.delete({
        where: {
          id,
        },
      });
    };

  export const collect = (input: IShoppingDeliveryJourney.ICreate) =>
    ({
      ...collectUpdate(input),
      id: v4(),
      created_at: new Date(),
    } satisfies Prisma.shopping_delivery_journeysCreateWithoutDeliveryInput);

  const collectUpdate = (input: IShoppingDeliveryJourney.ICreate) =>
    ({
      type: typia.assert<IShoppingDeliveryJourney.Type>(input.type),
      title: input.title,
      description: input.description,
      started_at: input.started_at,
      completed_at: input.completed_at,
      deleted_at: null,
    } satisfies Omit<
      Prisma.shopping_delivery_journeysCreateWithoutDeliveryInput,
      "id" | "created_at"
    >);
}
