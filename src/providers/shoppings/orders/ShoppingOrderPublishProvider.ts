import { Prisma } from "@prisma/client";

import { IShoppingOrderPublish } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPublish";

import { ShoppingAddressProvider } from "../actors/ShoppingAddressProvider";
import { ShoppingDeliveryPieceProvider } from "../deliveries/ShoppingDeliveryPieceProvider";

export namespace ShoppingOrderPublishProvider {
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
}
