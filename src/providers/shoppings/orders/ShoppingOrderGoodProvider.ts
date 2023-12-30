import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrderGood } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderGood";

import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingCartCommodityProvider } from "./ShoppingCartCommodityProvider";

export namespace ShoppingOrderGoodProvider {
  /* -----------------------------------------------------------
    TRANSFOMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = async (
      input: Prisma.shopping_order_goodsGetPayload<ReturnType<typeof select>>,
    ): Promise<IShoppingOrderGood> => {
      if (input.mv_price === null)
        throw ErrorProvider.internal("mv_price is null");
      return {
        id: input.id,
        commodity: await ShoppingCartCommodityProvider.json.transform(
          input.commodity,
        ),
        volume: input.volume,
        price: {
          nominal: input.mv_price.nominal,
          real: input.mv_price.real,
          cash: input.mv_price.cash,
          deposit: input.mv_price.deposit,
          mileage: input.mv_price.mileage,
          ticket: input.mv_price.ticket,
        },
        state: (input.mv_state?.value ?? null) as "none",
        confirmed_at: input.confirmed_at?.toISOString() ?? null,
      };
    };
    export const select = () =>
      ({
        include: {
          commodity: ShoppingCartCommodityProvider.json.select(),
          mv_price: true,
          mv_state: true,
        },
      } satisfies Prisma.shopping_order_goodsFindManyArgs);
  }

  export const collect =
    (seller: IEntity) =>
    (commodity: IShoppingCartCommodity) =>
    (input: IShoppingOrderGood.ICreate, sequence: number) =>
      ({
        id: v4(),
        commodity: {
          connect: { id: commodity.id },
        },
        seller: {
          connect: { id: seller.id },
        },
        volume: input.volume,
        mv_price: {
          create: {
            nominal: commodity.price.nominal * input.volume,
            real: commodity.price.real * input.volume,
            cash: commodity.price.real * input.volume,
            deposit: 0,
            mileage: 0,
            ticket: 0,
          },
        },
        sequence,
      } satisfies Prisma.shopping_order_goodsCreateWithoutOrderInput);
}
