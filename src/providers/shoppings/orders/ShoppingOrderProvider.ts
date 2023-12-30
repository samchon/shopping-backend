import { ArrayUtil } from "@nestia/e2e";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingCustomerProvider } from "../actors/ShoppingCustomerProvider";
import { ShoppingCartCommodityProvider } from "./ShoppingCartCommodityProvider";
import { ShoppingOrderGoodProvider } from "./ShoppingOrderGoodProvider";
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
          cash: input.mv_price.cash,
          deposit: input.mv_price.deposit,
          mileage: input.mv_price.mileage,
          ticket: input.mv_price.ticket,
          ticket_payments: [], // @todo
        },
        created_at: input.created_at.toISOString(),
      };
    };
    export const select = () =>
      ({
        include: {
          customer: ShoppingCustomerProvider.json.select(),
          goods: ShoppingOrderGoodProvider.json.select(),
          publish: ShoppingOrderPublishProvider.json.select(),
          mv_price: true,
        },
      } satisfies Prisma.shopping_ordersFindManyArgs);
  }

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
      if (commodities.length !== input.goods.length)
        throw ErrorProvider.notFound({
          accessor: "input.goods[].commodity_id",
          message: "Unable to find some commodities.",
        });

      // COLLECT GOODS
      const goods = input.goods.map((raw, i) => {
        const commodity: IShoppingCartCommodity | undefined = commodities.find(
          (c) => c.id === raw.commodity_id,
        );
        if (commodity === undefined)
          throw ErrorProvider.internal(
            "Unable to find commodity of matched sale.",
          );
        const sellerId: string = commodity.sale.seller.id;
        return ShoppingOrderGoodProvider.collect({
          id: sellerId,
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
        },
        ...json.select(),
      });
      return json.transform(record);
    };
}
