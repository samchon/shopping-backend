import { AesPkcs5 } from "@nestia/fetcher/lib/AesPkcs5";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingDeliveryShipper } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryShipper";

import { ShoppingGlobal } from "../../../ShoppingGlobal";

export namespace ShoppingDeliveryShipperProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_delivery_shippersGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingDeliveryShipper => ({
      id: v4(),
      company: input.company,
      name: decrypt(input.name),
      mobile: decrypt(input.mobile),
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({} satisfies Prisma.shopping_delivery_shippersFindManyArgs);
  }

  export const create =
    (seller: IShoppingSeller.IInvert) =>
    (id: string) =>
    async (
      input: IShoppingDeliveryShipper.ICreate,
    ): Promise<IShoppingDeliveryShipper> => {
      const delivery =
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
        });
      const record =
        await ShoppingGlobal.prisma.shopping_delivery_shippers.create({
          data: {
            ...collect(input),
            shopping_delivery_id: delivery.id,
          },
          ...json.select(),
        });
      return json.transform(record);
    };

  export const collect = (input: IShoppingDeliveryShipper.ICreate) =>
    ({
      id: v4(),
      company: input.company,
      name: encrypt(input.name),
      mobile: encrypt(input.mobile),
      created_at: new Date(),
    } satisfies Prisma.shopping_delivery_shippersCreateWithoutDeliveryInput);

  const decrypt = (str: string): string => AesPkcs5.decrypt(str, KEY, IV);
  const encrypt = (str: string): string => AesPkcs5.encrypt(str, KEY, IV);
}

const KEY = "iiedyie2ron8kxfdk46b05imuxlo4p0n";
const IV = "suhqmdijfewg89zb";
